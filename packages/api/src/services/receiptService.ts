import OpenAI from "openai";
import { z } from "zod";
import { ParsedReceipt } from "@wesplit/shared";
import { ValidationError } from "../utils/errors";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const receiptSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      priceGbp: z.number(),
    })
  ),
  subtotalGbp: z.number(),
  serviceChargeGbp: z.number(),
  vatGbp: z.number(),
  tipGbp: z.number(),
  totalGbp: z.number(),
});

const SYSTEM_PROMPT =
  'You are a receipt parser for a UK bill-splitting app. Extract every line item with its price in GBP, plus subtotal, service charge, VAT, tip, and total. Return only valid JSON in this exact shape: { items: [{ name, priceGbp }], subtotalGbp, serviceChargeGbp, vatGbp, tipGbp, totalGbp }. Use 0 for any missing value. Return no text outside the JSON object.';

export async function parseReceipt(base64Image: string): Promise<ParsedReceipt> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
          {
            type: "text",
            text: SYSTEM_PROMPT,
          },
        ],
      },
    ],
    max_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ValidationError("No response from receipt parser");

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new ValidationError("Failed to parse receipt response as JSON");
  }

  const result = receiptSchema.safeParse(parsed);
  if (!result.success) {
    throw new ValidationError("Receipt response did not match expected schema");
  }

  return result.data;
}
