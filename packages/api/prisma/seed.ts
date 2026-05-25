import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("TestPassword123!", 12);

  const host = await prisma.user.upsert({
    where: { email: "host@example.com" },
    update: {},
    create: {
      name: "Alex Host",
      email: "host@example.com",
      phone: "+447700900001",
      passwordHash,
      walletBalanceGbp: 0,
    },
  });

  const existingSplit = await prisma.split.findFirst({
    where: { hostId: host.id, name: "Friday Dinner" },
  });

  if (!existingSplit) {
    await prisma.split.create({
      data: {
        name: "Friday Dinner",
        totalGbp: 90.0,
        hostId: host.id,
        members: {
          create: [
            {
              guestName: "Sam",
              guestContact: "+447700900002",
              contactType: "PHONE",
              shareGbp: 30.0,
            },
            {
              guestName: "Jordan",
              guestContact: "jordan@example.com",
              contactType: "EMAIL",
              shareGbp: 30.0,
            },
            {
              guestName: "Taylor",
              guestContact: "+447700900003",
              contactType: "PHONE",
              shareGbp: 30.0,
            },
          ],
        },
        lineItems: {
          create: [
            { name: "Steak", priceGbp: 25.0 },
            { name: "Pasta", priceGbp: 18.0 },
            { name: "Risotto", priceGbp: 20.0 },
            { name: "Wine (bottle)", priceGbp: 22.0 },
            { name: "Service charge", priceGbp: 5.0 },
          ],
        },
      },
    });
  }

  console.log("Seed complete. Test host:", host.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
