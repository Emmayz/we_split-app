import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export async function corsPlugin(fastify: FastifyInstance) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  await fastify.register(fastifyCors, {
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
  });
}
