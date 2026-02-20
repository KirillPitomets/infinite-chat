import {Prisma} from "@/prisma/generated/client"

export type ChatMessagePrismaType = Prisma.MessageGetPayload<{
  select: {
    id: true
    content: true
    createdAt: true
    updatedAt: true
    isDeleted: true
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
