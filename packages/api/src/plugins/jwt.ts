import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

export async function jwtPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_ACCESS_SECRET ?? "fallback_secret",
  });
}
