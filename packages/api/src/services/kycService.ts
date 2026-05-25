import { PrismaClient, KycStatus } from "@prisma/client";
import { getOrCreateConnectAccount } from "./stripeService";

export function createKycService(prisma: PrismaClient) {
  async function startOnboarding(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const webUrl = process.env.WEB_URL ?? "http://localhost:3001";
    const { accountId, onboardingUrl } = await getOrCreateConnectAccount(
      userId,
      user.email,
      user.stripeConnectAccountId,
      webUrl
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeConnectAccountId: accountId,
        kycStatus: KycStatus.PENDING,
      },
    });

    return onboardingUrl;
  }

  async function handleAccountUpdate(
    accountId: string,
    chargesEnabled: boolean,
    payoutsEnabled: boolean
  ): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { stripeConnectAccountId: accountId },
    });
    if (!user) return;

    let kycStatus: KycStatus = KycStatus.PENDING;
    if (chargesEnabled && payoutsEnabled) {
      kycStatus = KycStatus.VERIFIED;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { kycStatus },
    });
  }

  return { startOnboarding, handleAccountUpdate };
}
