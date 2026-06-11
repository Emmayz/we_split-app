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
  const payload = request.user as { type?: string };
  if (payload.type !== "access") {
    throw new UnauthorisedError("Invalid token type");
  }
}
