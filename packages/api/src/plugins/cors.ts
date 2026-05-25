import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
  });
}
