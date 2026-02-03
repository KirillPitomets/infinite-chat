import {Static, t} from "elysia"

export const ChatMessageSchema = t.Object({
  id: t.String(),
  content: t.String(),
  sender: t.Object({
    id: t.String(),
    name: t.String(),
    tag: t.String(),
    imageUrl: t.String()
  }),
  isMine: t.Boolean(),
  createdAt: t.String({format: "date-time"})
})

export type ChatMessageDTO = Static<typeof ChatMessageSchema>
