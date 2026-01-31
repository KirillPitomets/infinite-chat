import {Prisma} from "@/prisma/generated/client"
import {Static, t} from "elysia"
import {ChatMessageSchema} from "./message.schema"

const baseUserChatPreviewSchema = t.Object({
  id: t.String(),
  createdAt: t.String({format: "date-time"}),
  lastMessage: t.Union([ChatMessageSchema, t.Null()])
})

const DirectUserChatPreviewSchema = t.Intersect([
  baseUserChatPreviewSchema,
  t.Object({
    type: t.Literal("DIRECT"),
    otherUser: t.Object({
      id: t.String(),
      name: t.String(),
      tag: t.String(),
      lastSeen: t.String({format: "date-time"}),
      imageUrl: t.String()
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
