import { PrismaClient, TransactionType, TransactionStatus } from "@prisma/client";
import { ValidationError } from "../utils/errors";

export function createWalletService(prisma: PrismaClient) {
  async function creditWallet(
    userId: string,
    amountGbp: number,
    description: string,
    splitId?: string
  ): Promise<void> {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { walletBalanceGbp: { increment: amountGbp } },
      }),
      prisma.walletTransaction.create({
        data: {
          userId,
          type: TransactionType.CREDIT,
          amountGbp,
          description,
          splitId: splitId ?? null,
          status: TransactionStatus.COMPLETED,
        },
      }),
    ]);
  }

  async function debitWallet(
    userId: string,
    amountGbp: number,
    description: string
  ): Promise<void> {
    // Atomic conditional decrement: only succeeds if balance >= amount
    const result = await prisma.user.updateMany({
      where: { id: userId, walletBalanceGbp: { gte: amountGbp } },
      data: { walletBalanceGbp: { decrement: amountGbp } },
    });
    if (result.count === 0) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
      throw new ValidationError(user ? "Insufficient wallet balance" : "User not found");
    }

    await prisma.walletTransaction.create({
      data: {
        userId,
        type: TransactionType.DEBIT,
        amountGbp,
        description,
        status: TransactionStatus.COMPLETED,
      },
    });
  }

  // Atomically debits the wallet and creates a PENDING withdrawal record.
  // Returns the wallet transaction ID so the caller can attach a stripePayoutId later.
  async function recordWithdrawal(
    userId: string,
    amountGbp: number
  ): Promise<string> {
    const result = await prisma.user.updateMany({
      where: { id: userId, walletBalanceGbp: { gte: amountGbp } },
      data: { walletBalanceGbp: { decrement: amountGbp } },
    });
    if (result.count === 0) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
      throw new ValidationError(user ? "Insufficient wallet balance" : "User not found");
    }

    const tx = await prisma.walletTransaction.create({
      data: {
        userId,
        type: TransactionType.WITHDRAWAL,
        amountGbp,
        description: "Withdrawal to bank account",
        status: TransactionStatus.PENDING,
      },
    });
    return tx.id;
  }

  return { creditWallet, debitWallet, recordWithdrawal };
}
