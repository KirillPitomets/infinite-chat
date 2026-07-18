import { Attachment } from "@/prisma/generated/client"
import z from "zod"

export const MessageAttachmentSchema = z.object({
  url: z.string(),
  key: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string()
})

export const ReplyPreviewMessage = z.object({
  id: z.string(),
  content: z.union([z.string(), z.null()]),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string(),
    tag: z.string()
  })
})

export const ChatMessageSchema = z.object({
  id: z.string(),
  content: z.union([z.string(), z.null()]),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    imageUrl: z.string()
  }),
  replyToMessage: ReplyPreviewMessage.optional(),
  attachments: z.array(MessageAttachmentSchema),
  isDeleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>
export type MessageAttachment = z.infer<typeof MessageAttachmentSchema>

export const messageAttachmentsMapper = (
  attachments: Attachment[]
): MessageAttachment[] => {
  return attachments.map(attach => ({
    key: attach.key,
    name: attach.name,
    size: attach.size,
    type: attach.type,
    url: attach.url
  }))
}
