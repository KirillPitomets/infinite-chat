import {Prisma} from "@/prisma/generated/client"
import {Static, t} from "elysia"

export const UserChatPreviewSchema = t.Object({
  id: t.String(),
  type: t.Union([t.Literal("DIRECT"), t.Literal("GROUP")]),
  createdAt: t.Date(),

  otherUser: t.Object({
    id: t.String(),
    name: t.String(),
    tag: t.String(),
    lastSeen: t.Date()
  }),

  lastMessage: t.Union([
    t.Object({
      id: t.String(),
      senderId: t.String(),
      content: t.String(),
      createdAt: t.Date()
    }),
    t.Null()
  ])
})

export type UserChatPreviewDTO = Static<typeof UserChatPreviewSchema>

export type ChatPreviewPrismaType = Prisma.ChatGetPayload<{
  select: {
    id: true
    type: true
    createdAt: true
    memberships: {
      select: {
        user: {
          select: {
            id: true
            name: true
            tag: true
            lastSeen: true
          }
        }
      }
    }
    messages: {
      select: {
        id: true
        senderId: true
        content: true
        createdAt: true
      }
    }
  }
}>