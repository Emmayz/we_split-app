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
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ValidationError("User not found");
    if (Number(user.walletBalanceGbp) < amountGbp) {
      throw new ValidationError("Insufficient wallet balance");
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { walletBalanceGbp: { decrement: amountGbp } },
      }),
      prisma.walletTransaction.create({
        data: {
          userId,
          type: TransactionType.DEBIT,
          amountGbp,
          description,
          status: TransactionStatus.COMPLETED,
        },
      }),
    ]);
  }

  async function recordWithdrawal(
    userId: string,
    amountGbp: number,
    stripePayoutId: string
  ): Promise<string> {
    await prisma.user.update({
      where: { id: userId },
      data: { walletBalanceGbp: { decrement: amountGbp } },
    });
    const tx = await prisma.walletTransaction.create({
      data: {
        userId,
        type: TransactionType.WITHDRAWAL,
        amountGbp,
        description: "Withdrawal to bank account",
        stripePayoutId,
        status: TransactionStatus.PENDING,
      },
    });
    return tx.id;
  }

  return { creditWallet, debitWallet, recordWithdrawal };
}
