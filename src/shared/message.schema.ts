import {Prisma} from "@/prisma/generated/client"
import {Static, t} from "elysia"

export const ChatMessageSchema = t.Object({
  id: t.String(),
  content: t.String(),
  sender: t.Object({
    id: t.String(),
    name: t.String(),
    tag: t.String()
  }),
  updatedAt: t.String({format: "date-time"})
})

export type ChatMessageDTO = Static<typeof ChatMessageSchema>

export type ChatMessagePrismaType = Prisma.MessageGetPayload<{
  select: {
    id: true
    content: true
    updatedAt: true
    sender: {
      select: {
        id: true
        name: true
        tag: true
      }
    }
  }
}>
