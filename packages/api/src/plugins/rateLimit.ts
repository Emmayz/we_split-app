import fastifyRateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyRateLimit, {
    global: true,
    max: 100,
    timeWindow: "1 minute",
  });
}
