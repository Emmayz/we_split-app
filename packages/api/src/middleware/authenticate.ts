import { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorisedError } from "../utils/errors";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorisedError("Invalid or missing token");
  }
}
