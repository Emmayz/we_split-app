import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyMultipart from "@fastify/multipart";
import { PrismaClient } from "@prisma/client";
import { AppError } from "./utils/errors";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";
import { splitsRoutes } from "./routes/splits";
import { receiptRoutes } from "./routes/receipt";
import { guestRoutes } from "./routes/guest";
import { paymentsRoutes } from "./routes/payments";
import { walletRoutes } from "./routes/wallet";
import { webhookRoutes } from "./routes/webhooks";
import { authenticate } from "./middleware/authenticate";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

import { FastifyRequest, FastifyReply } from "fastify";

export function buildApp(prisma: PrismaClient) {
  const fastify = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty" }
          : undefined,
    },
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_ACCESS_SECRET ?? "fallback_secret",
  });

  fastify.register(fastifyCors, { origin: true, credentials: true });

  fastify.register(fastifyRateLimit, {
    global: true,
    max: 100,
    timeWindow: "1 minute",
  });

  fastify.register(fastifyMultipart, {
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  fastify.decorate("authenticate", authenticate);

  // Capture raw body for Stripe webhook signature verification
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (req, body, done) => {
      (req as FastifyRequest & { rawBody: Buffer }).rawBody = body as Buffer;
      try {
        done(null, JSON.parse((body as Buffer).toString()));
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  );

  fastify.register(authRoutes, { prisma });
  fastify.register(usersRoutes, { prisma });
  fastify.register(splitsRoutes, { prisma });
  fastify.register(receiptRoutes);
  fastify.register(guestRoutes, { prisma });
  fastify.register(paymentsRoutes, { prisma });
  fastify.register(walletRoutes, { prisma });
  fastify.register(webhookRoutes, { prisma });

  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
      });
    }

    fastify.log.error(error);

    const isDev = process.env.NODE_ENV === "development";
    return reply.status(500).send({
      message: "Internal server error",
      code: "INTERNAL_ERROR",
      statusCode: 500,
      ...(isDev && { stack: error.stack }),
    });
  });

  return fastify;
}
