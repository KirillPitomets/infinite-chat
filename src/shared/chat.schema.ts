import {Prisma} from "@/prisma/generated/client"
import {Static, t} from "elysia"

const BaseChatDetailsSchema = t.Object({
  id: t.String(),
  createdAt: t.String({format: "date-time"})
})

const DirectChatDetailsSchema = t.Intersect([
  BaseChatDetailsSchema,
  t.Object({
    type: t.Literal("DIRECT"),
    otherUser: t.Object({
      id: t.String(),
      name: t.String(),
      tag: t.String(),
      imageUrl: t.String()
    })
  })
])

const GroupChatDetailsSchema = t.Intersect([
  BaseChatDetailsSchema,
  t.Object({
    type: t.Literal("GROUP"),
    name: t.String(),
    membersCount: t.Number(),
    imageUrl: t.String()
  })
])

export const ChatDetailsSchema = t.Union([
  DirectChatDetailsSchema,
  GroupChatDetailsSchema
])

export type ChatDetailsDTO = Static<typeof ChatDetailsSchema>

