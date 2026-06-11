import { FastifyInstance } from "fastify";
import { UnauthorisedError } from "../utils/errors";

export interface TokenPayload {
  userId: string;
  type: "access" | "refresh";
}

export function createAuthService(fastify: FastifyInstance) {
  function generateTokenPair(userId: string) {
    const accessToken = fastify.jwt.sign(
      { userId, type: "access" } satisfies TokenPayload,
      { expiresIn: "15m" }
    );
    const refreshToken = fastify.jwt.sign(
      { userId, type: "refresh" } satisfies TokenPayload,
      { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
  }

  function verifyAccessToken(token: string): TokenPayload {
    try {
      return fastify.jwt.verify<TokenPayload>(token);
    } catch {
      throw new UnauthorisedError("Invalid or expired access token");
    }
  }

  return { generateTokenPair, verifyAccessToken };
}
