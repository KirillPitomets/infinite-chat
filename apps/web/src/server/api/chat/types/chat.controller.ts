import { ChatDetailsSchema, ChatSchema } from "@/shared/schemes/chat.schema"
import { UserChatPreviewSchema } from "@/shared/schemes/chatPreview.schema"
import z from "zod"

export const ChatApiSchema = {
  create: {
    body: z.object({ memberTag: z.string() }),
    response: ChatSchema
  },
  updateLastReadAt: {
    body: z.object({ lastReadAt: z.iso.datetime() })
  },
  get: {
    response: ChatDetailsSchema
  },
  preview: { response: z.array(UserChatPreviewSchema) }
} as const
