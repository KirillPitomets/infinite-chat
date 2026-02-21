import z from "zod"
import { ChatMessageSchema } from "@/shared/schemes/message.schema"

const BaseUserChatPreviewSchema = z.object({
  id: z.string(),
  latestMessage: z.union([ChatMessageSchema, z.null()]),
  createdAt: z.string().datetime()
})

const DirectUserChatPreviewSchema = BaseUserChatPreviewSchema.extend({
  type: z.literal("DIRECT"),
  otherUser: z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    lastSeen: z.string().datetime(),
    imageUrl: z.string()
  })
})

const GroupUserChatPreviewSchema = BaseUserChatPreviewSchema.extend({
  type: z.literal("GROUP"),
  name: z.string(),
  membersCount: z.number()
})

export const UserChatPreviewSchema = z.union([
  DirectUserChatPreviewSchema,
  GroupUserChatPreviewSchema
])

export type UserChatPreview = z.infer<typeof UserChatPreviewSchema>
