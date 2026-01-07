import "dotenv/config"
import {PrismaPg} from "@prisma/adapter-pg"
import {PrismaClient} from "@/prisma/generated/client"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
