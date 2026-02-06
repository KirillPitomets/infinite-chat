import {Static, t} from "elysia"

const baseUserChatPreviewSchema = t.Object({
  id: t.String(),
  createdAt: t.String({format: "date-time"})
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
