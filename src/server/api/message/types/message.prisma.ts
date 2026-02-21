import { Prisma } from "@/prisma/generated/client"

export const ChatMessageInclude = {
  sender: {
    select: {
      id: true,
      name: true,
      tag: true,
      imageUrl: true
    }
  }
} satisfies Prisma.MessageInclude

export type ChatMessagePrismaType = Prisma.MessageGetPayload<{
  include: typeof ChatMessageInclude
}>
