import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { ValidationError, ForbiddenError, PaymentError } from "../utils/errors";
import { createWalletService } from "../services/walletService";
import { createPayout } from "../services/stripeService";
import { MIN_WITHDRAWAL_GBP } from "@wesplit/shared";

interface JwtPayload { userId: string }

const withdrawSchema = z.object({
  amountGbp: z.number().min(MIN_WITHDRAWAL_GBP),
  stripeBankAccountId: z.string().min(1),
});

export async function walletRoutes(fastify: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  const walletService = createWalletService(prisma);

  fastify.get("/wallet", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return {
      data: {
        walletBalanceGbp: Number(user?.walletBalanceGbp ?? 0),
        transactions: transactions.map((t) => ({
          ...t,
          amountGbp: Number(t.amountGbp),
        })),
      },
      message: "ok",
    };
  });

  fastify.post("/wallet/withdraw", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const body = withdrawSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError(body.error.issues[0]?.message ?? "Validation failed");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ValidationError("User not found");
    if (user.kycStatus !== "VERIFIED") throw new ForbiddenError("Identity verification required before withdrawal");
    if (!user.stripeConnectAccountId) throw new ForbiddenError("No Stripe account linked");

    // Atomically debit the wallet first before calling Stripe.
    // recordWithdrawal returns the DB transaction ID for later linking.
    const txId = await walletService.recordWithdrawal(userId, body.data.amountGbp);

    let payout;
    try {
      payout = await createPayout(user.stripeConnectAccountId, body.data.amountGbp);
    } catch (err) {
      // Stripe call failed — reverse the debit so the user's balance is restored
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { walletBalanceGbp: { increment: body.data.amountGbp } },
        }),
        prisma.walletTransaction.update({
          where: { id: txId },
          data: { status: "FAILED" },
        }),
      ]);
      throw new PaymentError("Failed to initiate withdrawal. Please try again.");
    }

    // Link the payout ID to the pending withdrawal transaction
    await prisma.walletTransaction.update({
      where: { id: txId },
      data: { stripePayoutId: payout.id },
    });

    return { data: { payoutId: payout.id }, message: "Withdrawal initiated" };
  });

  fastify.post("/wallet/kyc/start", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const { createKycService } = await import("../services/kycService");
    const kycService = createKycService(prisma);
    const url = await kycService.startOnboarding(userId);
    return { data: { url }, message: "KYC onboarding started" };
  });
}
