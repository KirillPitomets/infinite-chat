import {Prisma} from "@/prisma/generated/client"

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
