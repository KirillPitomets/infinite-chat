import {Static, t} from "elysia"

export const UserChatPreviewSchema = t.Object({
  id: t.String(),
  type: t.Union([t.Literal("DIRECT"), t.Literal("GROUP")]),
  createdAt: t.Date(),

  memberships: t.Array(
    t.Object({
      user: t.Object({
        id: t.String(),
        name: t.String(),
        tag: t.String(),
        lastSeen: t.Date()
      })
    })
  ),

  messages: t.Array(
    t.Object({
      id: t.String(),
      senderId: t.String(),
      content: t.String()
    })
  )
})

export type UserChatPreviewType = Static<typeof UserChatPreviewSchema>
