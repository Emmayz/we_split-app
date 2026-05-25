import { PrismaClient, SplitStatus } from "@prisma/client";

export function createSplitService(
  prisma: PrismaClient,
  creditWallet: (userId: string, amountGbp: number, description: string, splitId?: string) => Promise<void>
) {
  function calculateEvenShares(totalGbp: number, memberCount: number): number[] {
    const totalPence = Math.round(totalGbp * 100);
    const basePence = Math.floor(totalPence / memberCount);
    const remainderPence = totalPence - basePence * memberCount;

    return Array.from({ length: memberCount }, (_, i) =>
      (basePence + (i < remainderPence ? 1 : 0)) / 100
    );
  }

  async function checkAndSettle(splitId: string): Promise<void> {
    const split = await prisma.split.findUnique({
      where: { id: splitId },
      include: { members: true },
    });
    if (!split || split.status !== SplitStatus.ACTIVE) return;

    const allPaid = split.members.every((m) => m.paid);
    if (!allPaid) return;

    await prisma.split.update({
      where: { id: splitId },
      data: { status: SplitStatus.SETTLED, settledAt: new Date() },
    });
  }

  async function creditHostWallet(
    hostId: string,
    amountGbp: number,
    splitId: string
  ): Promise<void> {
    await creditWallet(hostId, amountGbp, "Payment received from guest", splitId);
  }

  return { calculateEvenShares, checkAndSettle, creditHostWallet };
}
