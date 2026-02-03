import {Prisma} from "@/prisma/generated/client"

export type ChatPreviewPrismaType = Prisma.ChatGetPayload<{
  select: {
    id: true
    type: true
    createdAt: true
    name: true
    memberships: {
      select: {
        user: {
          select: {
            id: true
            name: true
            tag: true
            lastSeen: true
            imageUrl: true
          }
        }
      }
    }
    messages: {
      take: 1
      orderBy: {createdAt: "desc"}
      include: {
        sender: {
          select: {
            id: true
            name: true
            tag: true
            imageUrl: true
          }
        }
      }
    }
  }
}>
