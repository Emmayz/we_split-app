import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { validateUKPhone, normaliseToE164 } from "../utils/phone";
import { ValidationError, UnauthorisedError, ConflictError } from "../utils/errors";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().refine(validateUKPhone, { message: "Invalid UK phone number" }),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

interface JwtPayload {
  userId: string;
  type: string;
}

export async function authRoutes(fastify: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;

  fastify.post("/auth/register", {
    config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const body = registerSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError(body.error.issues[0]?.message ?? "Validation failed");

    const { name, email, password } = body.data;
    const phone = normaliseToE164(body.data.phone);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing) throw new ConflictError("Email or phone already registered");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash },
    });

    const accessToken = fastify.jwt.sign({ userId: user.id, type: "access" }, { expiresIn: "15m" });
    const refreshToken = fastify.jwt.sign({ userId: user.id, type: "refresh" }, { expiresIn: "7d" });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return reply.status(201).send({
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          walletBalanceGbp: Number(user.walletBalanceGbp),
          kycStatus: user.kycStatus,
          createdAt: user.createdAt,
        },
      },
      message: "Registered successfully",
    });
  });

  fastify.post("/auth/login", {
    config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError("Invalid credentials format");

    const { email, password } = body.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorisedError("Invalid email or password");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorisedError("Invalid email or password");

    const accessToken = fastify.jwt.sign({ userId: user.id, type: "access" }, { expiresIn: "15m" });
    const refreshToken = fastify.jwt.sign({ userId: user.id, type: "refresh" }, { expiresIn: "7d" });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return reply.send({
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          walletBalanceGbp: Number(user.walletBalanceGbp),
          kycStatus: user.kycStatus,
          createdAt: user.createdAt,
        },
      },
      message: "Logged in",
    });
  });

  fastify.post("/auth/refresh", async (request, reply) => {
    const body = refreshSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError("refreshToken required");

    let payload: JwtPayload;
    try {
      payload = fastify.jwt.verify<JwtPayload>(body.data.refreshToken);
    } catch {
      throw new UnauthorisedError("Invalid refresh token");
    }

    if (payload.type !== "refresh") throw new UnauthorisedError("Invalid token type");

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== body.data.refreshToken) {
      throw new UnauthorisedError("Refresh token revoked");
    }

    const accessToken = fastify.jwt.sign({ userId: user.id, type: "access" }, { expiresIn: "15m" });
    const newRefreshToken = fastify.jwt.sign({ userId: user.id, type: "refresh" }, { expiresIn: "7d" });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

    return reply.send({
      data: { accessToken, refreshToken: newRefreshToken },
      message: "Tokens refreshed",
    });
  });

  fastify.post("/auth/logout", {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as JwtPayload;
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
    return reply.send({ data: null, message: "Logged out" });
  });
}
