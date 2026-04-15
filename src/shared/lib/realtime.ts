import { Realtime, InferRealtimeEvents } from "@upstash/realtime"
import { redis } from "./redis"
import { z } from "zod"
import { ChatMessageSchema } from "@/shared/schemes/message.schema"
import { UserChatPreviewSchema } from "@/shared/schemes/chatPreview.schema"

const schema = {
  chat: {
    presence: {
      typing: z.object({
        isTyping: z.boolean(),
        user: z.object({ id: z.string(), name: z.string() })
      })
    },
    created: z.object({
      memberships: z.array(z.object({ userId: z.string() })),
      preview: UserChatPreviewSchema
    }),
    deleted: z.object({
      memberships: z.array(z.object({ userId: z.string() })),
      chatId: z.string()
    }),
    message: {
      created: z.object({ message: ChatMessageSchema, chatId: z.string() }),
      updated: z.object({ message: ChatMessageSchema, chatId: z.string() }),
      deleted: z.object({ message: ChatMessageSchema, chatId: z.string() }),
      readed: z.object({
        userId: z.string(),
        chatId: z.string(),
        lastReadAt: z.iso.datetime()
      })
    }
  },
  user: {
    presence: z.object({
      userId: z.string(),
      lastSeen: z.number()
    })
  },
  notification: {
    message: {
      created: z.object({ message: ChatMessageSchema, chatId: z.string() })
    }
  }
}

export const realtime = new Realtime({ schema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
export type RealtimeChannel = ReturnType<typeof realtime.channel>
