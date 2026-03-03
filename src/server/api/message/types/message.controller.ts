import { UserChatPreviewSchema } from "@/shared/schemes/chatPreview.schema"
import {
  ChatMessageSchema,
  MessageAttachmentSchema
} from "@/shared/schemes/message.schema"
import z from "zod"

export const MessageApiSchema = {
  create: {
    body: z.object({
      chatId: z.string(),
      content: z.string().max(2000),
      files: z.array(MessageAttachmentSchema).default([])
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
    body: z
      .object({
        content: z.string().max(2000),
        files: z.array(MessageAttachmentSchema).optional()
      })
      .refine(data => data.content || (data.files && data.files.length > 0), {
        error: "You must provide either content or files",
        path: ["content"]
      }),
    response: ChatMessageSchema
  },
  preview: { response: z.array(UserChatPreviewSchema) },
  delete: { response: ChatMessageSchema }
} as const
