import { UserChatPreviewSchema } from "@/shared/schemes/chatPreview.schema"
import { ChatMessageSchema } from "@/shared/schemes/message.schema"
import z from "zod"

export const MessageApiSchema = {
  create: {
    body: z.object({
      chatId: z.string(),
      content: z.string().max(2000)
    }),
    response: ChatMessageSchema
  },
  get: {
    query: z.object({ chatId: z.string() }),
    response: z.array(ChatMessageSchema)
  },
  getLatest: {
    query: z.object({ chatId: z.string() }),
    response: z.union([ChatMessageSchema, z.null()])
  },
  put: {
    body: z.object({ content: z.string() }),
    response: ChatMessageSchema
  },
  preview: { response: z.array(UserChatPreviewSchema) },
  delete: { response: ChatMessageSchema }
} as const
