import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient, SplitStatus } from "@prisma/client";
import { ValidationError, NotFoundError, ForbiddenError } from "../utils/errors";
import { createGuestService } from "../services/guestService";
import { createSplitService } from "../services/splitService";
import { createWalletService } from "../services/walletService";
import { sendGuestInvite, sendReminder } from "../services/notificationService";
import { MAX_SPLIT_MEMBERS } from "@wesplit/shared";

interface JwtPayload { userId: string }

const memberSchema = z.object({
  guestName: z.string().min(1),
  guestContact: z.string().min(1),
  contactType: z.enum(["PHONE", "EMAIL"]),
});

const createSplitSchema = z.object({
  name: z.string().min(1).max(200),
  totalGbp: z.number().positive(),
  members: z.array(memberSchema).min(1).max(MAX_SPLIT_MEMBERS),
  splitType: z.enum(["EVEN", "ITEMISED"]),
});

const patchSplitSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  lineItems: z
    .array(z.object({ id: z.string(), assignedToMemberId: z.string().nullable() }))
    .optional(),
});

function formatSplit(split: any) {
  return {
    ...split,
    totalGbp: Number(split.totalGbp),
    members: split.members?.map((m: any) => ({
      ...m,
      shareGbp: Number(m.shareGbp),
    })),
    lineItems: split.lineItems?.map((l: any) => ({
      ...l,
      priceGbp: Number(l.priceGbp),
    })),
  };
}

export async function splitsRoutes(fastify: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  const guestService = createGuestService(prisma);
  const walletService = createWalletService(prisma);
  const splitService = createSplitService(prisma, walletService.creditWallet);

  fastify.get("/splits", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;

    // Fetch the user's contact details so we can find splits they owe as a member
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true },
    });

    const splits = await prisma.split.findMany({
      where: {
        OR: [
          { hostId: userId },
          ...(currentUser
            ? [
                { members: { some: { guestContact: currentUser.email } } },
                { members: { some: { guestContact: currentUser.phone } } },
              ]
            : []),
        ],
      },
      include: { members: true, lineItems: true },
      orderBy: { createdAt: "desc" },
    });
    return { data: splits.map(formatSplit), message: "ok" };
  });

  fastify.post("/splits", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user as JwtPayload;
    const body = createSplitSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError(body.error.issues[0]?.message ?? "Validation failed");

    const { name, totalGbp, members, splitType } = body.data;

    // Both EVEN and ITEMISED use penny-correct share distribution at creation time.
    // ITEMISED shares can be refined later via PATCH /splits/:id with line item assignments.
    const shares = splitService.calculateEvenShares(totalGbp, members.length);

    const split = await prisma.split.create({
      data: {
        name,
        totalGbp,
        hostId: userId,
        members: {
          create: members.map((m, i) => ({
            guestName: m.guestName,
            guestContact: m.guestContact,
            contactType: m.contactType,
            shareGbp: shares[i],
          })),
        },
      },
      include: { members: true, lineItems: true },
    });

    const host = await prisma.user.findUnique({ where: { id: userId } });

    for (const member of split.members) {
      const token = await guestService.generateToken(split.id, member.id);
      try {
        await sendGuestInvite(
          member.guestContact,
          member.contactType,
          member.guestName,
          host?.name ?? "Your host",
          split.name,
          Number(member.shareGbp),
          token
        );
      } catch (err) {
        fastify.log.warn({ err }, "Failed to send invite notification");
      }
    }

    return reply.status(201).send({ data: formatSplit(split), message: "Split created" });
  });

  fastify.get("/splits/:id", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const { id } = request.params as { id: string };

    const split = await prisma.split.findUnique({
      where: { id },
      include: { members: true, lineItems: true },
    });
    if (!split) throw new NotFoundError("Split not found");
    if (split.hostId !== userId) throw new ForbiddenError("Access denied");

    return { data: formatSplit(split), message: "ok" };
  });

  fastify.patch("/splits/:id", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const { id } = request.params as { id: string };
    const body = patchSplitSchema.safeParse(request.body);
    if (!body.success) throw new ValidationError(body.error.issues[0]?.message ?? "Validation failed");

    const split = await prisma.split.findUnique({ where: { id } });
    if (!split) throw new NotFoundError("Split not found");
    if (split.hostId !== userId) throw new ForbiddenError("Only the host can edit this split");

    if (body.data.name) {
      await prisma.split.update({ where: { id }, data: { name: body.data.name } });
    }

    if (body.data.lineItems) {
      // Only members of this split may be assigned; reject anything else.
      const memberIds = new Set(
        (await prisma.splitMember.findMany({ where: { splitId: id }, select: { id: true } })).map(
          (m) => m.id
        )
      );
      for (const item of body.data.lineItems) {
        if (item.assignedToMemberId !== null && !memberIds.has(item.assignedToMemberId)) {
          throw new ValidationError("assignedToMemberId is not a member of this split");
        }
        // Scope the update to this split so a host cannot reassign another split's line items.
        await prisma.lineItem.updateMany({
          where: { id: item.id, splitId: id },
          data: { assignedToMemberId: item.assignedToMemberId },
        });
      }
    }

    const updated = await prisma.split.findUnique({
      where: { id },
      include: { members: true, lineItems: true },
    });

    return { data: formatSplit(updated), message: "Updated" };
  });

  fastify.post("/splits/:id/invite/:memberId", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const { id, memberId } = request.params as { id: string; memberId: string };

    const split = await prisma.split.findUnique({ where: { id }, include: { members: true } });
    if (!split) throw new NotFoundError("Split not found");
    if (split.hostId !== userId) throw new ForbiddenError("Only the host can resend invites");

    const member = split.members.find((m) => m.id === memberId);
    if (!member) throw new NotFoundError("Member not found");

    const token = await guestService.regenerateToken(id, memberId);
    const host = await prisma.user.findUnique({ where: { id: userId } });

    await sendGuestInvite(
      member.guestContact,
      member.contactType,
      member.guestName,
      host?.name ?? "Your host",
      split.name,
      Number(member.shareGbp),
      token
    );

    return { data: { token }, message: "Invite sent" };
  });

  fastify.post("/splits/:id/remind/:memberId", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const { id, memberId } = request.params as { id: string; memberId: string };

    const split = await prisma.split.findUnique({ where: { id }, include: { members: true } });
    if (!split) throw new NotFoundError("Split not found");
    if (split.hostId !== userId) throw new ForbiddenError("Only the host can send reminders");

    const member = split.members.find((m) => m.id === memberId);
    if (!member) throw new NotFoundError("Member not found");

    const tokenRecord = await prisma.guestToken.findFirst({
      where: { memberId, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!tokenRecord) {
      const newToken = await guestService.regenerateToken(id, memberId);
      await sendReminder(
        member.guestContact,
        member.contactType,
        member.guestName,
        split.name,
        Number(member.shareGbp),
        newToken
      );
    } else {
      await sendReminder(
        member.guestContact,
        member.contactType,
        member.guestName,
        split.name,
        Number(member.shareGbp),
        tokenRecord.token
      );
    }

    return { data: null, message: "Reminder sent" };
  });

  fastify.patch("/splits/:id/members/:memberId", { preHandler: [fastify.authenticate] }, async (request) => {
    const { userId } = request.user as JwtPayload;
    const { id, memberId } = request.params as { id: string; memberId: string };
    const body = z.object({ paid: z.literal(true) }).safeParse(request.body);
    if (!body.success) throw new ValidationError("Body must be { paid: true }");

    const split = await prisma.split.findUnique({ where: { id } });
    if (!split) throw new NotFoundError("Split not found");
    if (split.hostId !== userId) throw new ForbiddenError("Only the host can mark payments");

    // Scope the write to this split so a host cannot flip a member of another split.
    const result = await prisma.splitMember.updateMany({
      where: { id: memberId, splitId: id },
      data: { paid: true, paidAt: new Date() },
    });
    if (result.count === 0) throw new NotFoundError("Member not found");

    await splitService.checkAndSettle(id);

    const updated = await prisma.split.findUnique({
      where: { id },
      include: { members: true, lineItems: true },
    });

    return { data: formatSplit(updated), message: "Member marked as paid" };
  });
}
