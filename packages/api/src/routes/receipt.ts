import { FastifyInstance } from "fastify";
import { ForbiddenError, ValidationError } from "../utils/errors";
import { parseReceipt } from "../services/receiptService";

interface JwtPayload { userId: string }

export async function receiptRoutes(fastify: FastifyInstance) {
  fastify.post("/receipt/parse", {
    preHandler: [fastify.authenticate],
    config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
  }, async (request) => {
    const data = await request.file();
    if (!data) throw new ValidationError("No file uploaded");

    const { mimetype } = data;
    if (!["image/jpeg", "image/png"].includes(mimetype)) {
      throw new ValidationError("Only JPEG and PNG images are supported");
    }

    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length > 10 * 1024 * 1024) {
      throw new ValidationError("Image must be under 10MB");
    }

    const base64 = buffer.toString("base64");
    const receipt = await parseReceipt(base64);

    return { data: receipt, message: "Receipt parsed" };
  });
}
