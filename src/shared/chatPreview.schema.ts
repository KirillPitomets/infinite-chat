import {Prisma} from "@/prisma/generated/client"
import {Static, t} from "elysia"

const baseUserChatPreviewSchema = t.Object({
  id: t.String(),
  createdAt: t.String({format: "date-time"}),
  lastMessage: t.Union([
    t.Object({
      isMine: t.Boolean(),
      senderName: t.String(),
      content: t.String(),
      createdAt: t.String({format: "date-time"})
    }),
    t.Null()
  ])
})

const DirectUserChatPreviewSchema = t.Intersect([
  baseUserChatPreviewSchema,
  t.Object({
    type: t.Literal("DIRECT"),
    otherUser: t.Object({
      id: t.String(),
      name: t.String(),
      tag: t.String(),
      lastSeen: t.Date()
    })
  })
])

const GroupUserChatPreviewSchema = t.Intersect([
  baseUserChatPreviewSchema,
  t.Object({
    type: t.Literal("GROUP"),
    name: t.String(),
    membersCount: t.Number()
  })
])

export const UserChatPreviewSchema = t.Union([
  DirectUserChatPreviewSchema,
  GroupUserChatPreviewSchema
])

export type UserChatPreviewDTO = Static<typeof UserChatPreviewSchema>

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
          }
        }
      }
    }
    messages: {
      take: 1
      select: {
        id: true
        senderId: true
        content: true
        createdAt: true
        sender: {
          select: {
            name: true
          }
        }
      }
    }
  }
}>
