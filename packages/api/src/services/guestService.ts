import { PrismaClient } from "@prisma/client";
import { GuestToken } from "@wesplit/shared";
import { generateSecureToken } from "../utils/tokens";
import { NotFoundError, ExpiredTokenError } from "../utils/errors";
import { GUEST_TOKEN_EXPIRY_HOURS } from "@wesplit/shared";

export function createGuestService(prisma: PrismaClient) {
  async function generateToken(splitId: string, memberId: string): Promise<string> {
    const token = generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + GUEST_TOKEN_EXPIRY_HOURS);

    await prisma.guestToken.create({
      data: { token, splitId, memberId, expiresAt, used: false },
    });

    return token;
  }

  async function validateToken(token: string): Promise<GuestToken> {
    const record = await prisma.guestToken.findUnique({ where: { token } });
    if (!record) throw new NotFoundError("Token not found");
    if (record.used || record.expiresAt < new Date()) {
      throw new ExpiredTokenError("Token expired or already used");
    }
    return {
      token: record.token,
      splitId: record.splitId,
      memberId: record.memberId,
      expiresAt: record.expiresAt,
      used: record.used,
    };
  }

  async function markUsed(token: string): Promise<void> {
    await prisma.guestToken.update({ where: { token }, data: { used: true } });
  }

  async function regenerateToken(splitId: string, memberId: string): Promise<string> {
    await prisma.guestToken.deleteMany({ where: { memberId } });
    return generateToken(splitId, memberId);
  }

  return { generateToken, validateToken, markUsed, regenerateToken };
}
