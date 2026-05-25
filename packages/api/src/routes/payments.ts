import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { ValidationError } from "../utils/errors";
import { createGuestService } from "../services/guestService";
import { createPaymentIntent } from "../services/stripeService";

const intentSchema = z.object({ token: z.string() });

export async function paymentsRoutes(fastify: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  const guestService = createGuestService(prisma);

  fastify.post("/payments/intent", {
    config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
  }, async (request) => {
    const body = intentSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError("token required");

    const guestToken = await guestService.validateToken(body.data.token);

    const member = await prisma.splitMember.findUnique({
      where: { id: guestToken.memberId },
    });
    if (!member) throw new ValidationError("Member not found");

    const pi = await createPaymentIntent(Number(member.shareGbp), {
      splitId: guestToken.splitId,
      memberId: guestToken.memberId,
      token: body.data.token,
    });

    return {
      data: {
        clientSecret: pi.client_secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
      message: "Payment intent created",
    };
  });
}
