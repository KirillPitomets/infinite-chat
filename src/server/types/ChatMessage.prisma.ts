import {Prisma} from "@/prisma/generated/client"

export type ChatMessagePrismaType = Prisma.MessageGetPayload<{
  select: {
    id: true
    content: true
    createdAt: true
    sender: {
      select: {
        id: true
        name: true
        tag: true
        imageUrl: true
      }
    }
  }
}>
