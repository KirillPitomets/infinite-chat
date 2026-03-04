import { UserChatPreviewSchema } from "@/shared/schemes/chatPreview.schema"
import { ChatMessageSchema } from "@/shared/schemes/message.schema"
import z from "zod"

const refineMessageBody = {
  error: "You must provide either content or files",
  path: ["content"]
}

export const MessageApiSchema = {
  create: {
    body: z
      .object({
        content: z.string().max(2000),
        files: z.union([
          z.array(z.instanceof(File)).default([]),
          z.instanceof(File)
        ])
      })
      .refine(data => data.content || data.files, refineMessageBody),
    response: ChatMessageSchema
  },
  get: {
    response: z.array(ChatMessageSchema)
  },
  getLatest: {
    response: z.union([ChatMessageSchema, z.null()])
  },
  put: {
    body: z
      .object({
        content: z.string().max(2000),
        files: z.union([
          z.array(z.instanceof(File)).default([]),
          z.instanceof(File)
        ])
      })
      .refine(data => data.content || data.files, refineMessageBody),
    response: ChatMessageSchema
  },
  preview: { response: z.array(UserChatPreviewSchema) },
  delete: { response: ChatMessageSchema }
} as const
