import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { ValidationError, NotFoundError, PaymentError } from "../utils/errors";
import { createGuestService } from "../services/guestService";
import { createSplitService } from "../services/splitService";
import { createWalletService } from "../services/walletService";
import { retrievePaymentIntent } from "../services/stripeService";
import { sendPaymentConfirmation, notifyHostPaymentReceived } from "../services/notificationService";
import { gbpToPence } from "../utils/money";

const paySchema = z.object({
  paymentIntentId: z.string(),
  contactInfo: z.string().min(1),
});

export async function guestRoutes(fastify: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  const guestService = createGuestService(prisma);
  const walletService = createWalletService(prisma);
  const splitService = createSplitService(prisma, walletService.creditWallet);

  fastify.get("/guest/:token", {
    config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
  }, async (request) => {
    const { token } = request.params as { token: string };
    const guestToken = await guestService.validateToken(token);

    const member = await prisma.splitMember.findUnique({
      where: { id: guestToken.memberId },
      include: { split: { include: { host: true } } },
    });
    if (!member) throw new NotFoundError("Member not found");

    return {
      data: {
        splitName: member.split.name,
        hostName: member.split.host.name,
        memberName: member.guestName,
        shareGbp: Number(member.shareGbp),
        currency: "GBP",
        contactType: member.contactType,
        alreadyPaid: member.paid,
      },
      message: "ok",
    };
  });

  fastify.post("/guest/:token/pay", {
    config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
  }, async (request) => {
    const { token } = request.params as { token: string };
    const body = paySchema.safeParse(request.body);
    if (!body.success) throw new ValidationError(body.error.issues[0]?.message ?? "Validation failed");

    const guestToken = await guestService.validateToken(token);

    const member = await prisma.splitMember.findUnique({
      where: { id: guestToken.memberId },
      include: { split: true },
    });
    if (!member) throw new NotFoundError("Member not found");

    const pi = await retrievePaymentIntent(body.data.paymentIntentId);
    if (pi.status !== "succeeded") {
      throw new PaymentError("Payment has not succeeded");
    }
    if (pi.amount !== gbpToPence(Number(member.shareGbp))) {
      throw new PaymentError("Payment amount does not match share");
    }

    const paymentMethod =
      pi.payment_method_types[0] === "apple_pay"
        ? "APPLE_PAY"
        : pi.payment_method_types[0] === "google_pay"
        ? "GOOGLE_PAY"
        : "CARD";

    await prisma.splitMember.update({
      where: { id: member.id },
      data: {
        paid: true,
        paidAt: new Date(),
        paymentMethod,
        stripePaymentIntentId: pi.id,
      },
    });

    await splitService.creditHostWallet(member.split.hostId, Number(member.shareGbp), member.splitId);
    await guestService.markUsed(token);
    await splitService.checkAndSettle(member.splitId);

    try {
      await sendPaymentConfirmation(
        body.data.contactInfo,
        member.contactType,
        member.guestName,
        Number(member.shareGbp)
      );
      await notifyHostPaymentReceived(member.split.hostId, member.guestName, Number(member.shareGbp));
    } catch (err) {
      fastify.log.warn({ err }, "Failed to send payment confirmation");
    }

    return { data: { success: true }, message: "Payment confirmed" };
  });
}
