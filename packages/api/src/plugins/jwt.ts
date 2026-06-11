import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

export async function jwtPlugin(fastify: FastifyInstance) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET environment variable is required");
  await fastify.register(fastifyJwt, { secret });
}
