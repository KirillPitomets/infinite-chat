import { Prisma } from "@/prisma/generated/client"

export type ChatPrismaType = Prisma.ChatGetPayload<{
  select: {
    name: true
    id: true
    imageUrl: true
    createdAt: true
    type: true
    memberships: {
      select: {
        userId: true
      }
    }
  }
}>

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
      orderBy: { createdAt: "desc" }
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

export type ChatDetailsPrismaType = Prisma.ChatGetPayload<{
  select: {
    id: true
    type: true
    name: true
    createdAt: true
    imageUrl: true
    memberships: {
      select: {
        role: true
        user: {
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
