import { FastifyInstance, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    rawBody?: Buffer;
  }
}
import { PrismaClient, KycStatus } from "@prisma/client";
import { constructWebhookEvent } from "../services/stripeService";
import { createWalletService } from "../services/walletService";
import { createSplitService } from "../services/splitService";
import { penceToGbp } from "../utils/money";

export async function webhookRoutes(fastify: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  const walletService = createWalletService(prisma);
  const splitService = createSplitService(prisma, walletService.creditWallet);

  fastify.post("/webhooks/stripe", {
    config: { rawBody: true },
  }, async (request, reply) => {
    const signature = request.headers["stripe-signature"] as string;
    if (!signature) return reply.status(400).send({ message: "Missing signature" });

    let event;
    try {
      event = constructWebhookEvent(request.rawBody as Buffer, signature);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Webhook verification failed";
      return reply.status(400).send({ message: msg });
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as { id: string; amount: number; metadata: Record<string, string> };
        const { memberId, splitId, token } = pi.metadata;
        if (!memberId) break;

        const member = await prisma.splitMember.findUnique({ where: { id: memberId } });
        if (!member || member.paid) break;

        await prisma.splitMember.update({
          where: { id: memberId },
          data: {
            paid: true,
            paidAt: new Date(),
            paymentMethod: "CARD",
            stripePaymentIntentId: pi.id,
          },
        });

        const split = await prisma.split.findUnique({ where: { id: splitId } });
        if (split) {
          await walletService.creditWallet(
            split.hostId,
            penceToGbp(pi.amount),
            "Payment received from guest",
            splitId
          );
        }

        if (token) {
          await prisma.guestToken.updateMany({
            where: { token },
            data: { used: true },
          });
        }

        await splitService.checkAndSettle(splitId);
        break;
      }

      case "payout.paid": {
        const payout = event.data.object as { id: string };
        await prisma.walletTransaction.updateMany({
          where: { stripePayoutId: payout.id },
          data: { status: "COMPLETED" },
        });
        break;
      }

      case "payout.failed": {
        const payout = event.data.object as { id: string; amount: number };
        const tx = await prisma.walletTransaction.findFirst({
          where: { stripePayoutId: payout.id },
        });
        if (tx) {
          await prisma.walletTransaction.update({
            where: { id: tx.id },
            data: { status: "FAILED" },
          });
          await prisma.user.update({
            where: { id: tx.userId },
            data: { walletBalanceGbp: { increment: Number(tx.amountGbp) } },
          });
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as {
          id: string;
          charges_enabled: boolean;
          payouts_enabled: boolean;
        };
        const user = await prisma.user.findFirst({
          where: { stripeConnectAccountId: account.id },
        });
        if (user) {
          const status: KycStatus =
            account.charges_enabled && account.payouts_enabled
              ? KycStatus.VERIFIED
              : KycStatus.PENDING;
          await prisma.user.update({ where: { id: user.id }, data: { kycStatus: status } });
        }
        break;
      }

      default:
        fastify.log.info({ type: event.type }, "Unhandled webhook event");
    }

    return reply.send({ received: true });
  });
}
