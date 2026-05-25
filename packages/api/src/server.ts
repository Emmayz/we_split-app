import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { buildApp } from "./app";

const prisma = new PrismaClient();
const app = buildApp(prisma);

const port = parseInt(process.env.PORT ?? "3000", 10);
const host = "0.0.0.0";

app.listen({ port, host }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
});
