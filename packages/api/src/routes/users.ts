import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { ValidationError, NotFoundError } from "../utils/errors";

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

interface JwtPayload { userId: string }

export async function usersRoutes(fastify: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;

  fastify.get("/users/me", {
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        walletBalanceGbp: Number(user.walletBalanceGbp),
        stripeConnectAccountId: user.stripeConnectAccountId,
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
      },
      message: "ok",
    };
  });

  fastify.patch("/users/me", {
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const body = patchSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError(body.error.issues[0]?.message ?? "Validation failed");

    const user = await prisma.user.update({
      where: { id: userId },
      data: body.data,
    });

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        walletBalanceGbp: Number(user.walletBalanceGbp),
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
      },
      message: "Updated",
    };
  });
}
