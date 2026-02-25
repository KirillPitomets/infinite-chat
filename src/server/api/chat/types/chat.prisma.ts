import { Prisma } from "@/prisma/generated/client"

export const chatInclude = {
  memberships: {
    select: {
      userId: true
    }
  }
} satisfies Prisma.ChatInclude

export type ChatPrismaType = Prisma.ChatGetPayload<{
  include: typeof chatInclude
}>

export const chatPreviewInclude = {
  memberships: {
    select: {
      user: {
        select: {
          id: true,
          name: true,
          tag: true,
          lastSeen: true,
          imageUrl: true
        }
      }
    }
  },
  messages: {
    take: 1,
    orderBy: { createdAt: "desc" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          tag: true,
          imageUrl: true
        }
      }
    }
  }
} satisfies Prisma.ChatInclude

export type ChatPreviewPrismaType = Prisma.ChatGetPayload<{
  include: typeof chatPreviewInclude
}>

export const chatDetailsInclude = {
  memberships: {
    select: {
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          tag: true,
          imageUrl: true
        }
      }
    }
  }
} satisfies Prisma.ChatInclude

export type ChatDetailsPrismaType = Prisma.ChatGetPayload<{
  include: typeof chatDetailsInclude
}>

export const chatDeleteInclude = {
  memberships: { select: { userId: true } }
} satisfies Prisma.ChatInclude

export type ChatDeletePrismaType = Prisma.ChatGetPayload<{
  include: typeof chatDeleteInclude
}>
