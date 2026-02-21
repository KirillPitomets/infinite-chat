import z from "zod"

export const ChatSchema = z.object({
  id: z.string(),
  type: z.union([z.literal("DIRECT"), z.literal("GROUP")]),
  createdAt: z.string().datetime(),
  name: z.string(),
  imageUrl: z.string(),
  memberships: z.array(
    z.object({
      userId: z.string()
    })
  )
})

const BaseChatDetailsSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime()
})

const DirectChatDetailsSchema = BaseChatDetailsSchema.extend({
  type: z.literal("DIRECT"),
  otherUser: z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    imageUrl: z.string()
  })
})

const GroupChatDetailsSchema = BaseChatDetailsSchema.extend({
  type: z.literal("GROUP"),
  name: z.string(),
  membersCount: z.number(),
  imageUrl: z.string()
})

export const ChatDetailsSchema = z.union([
  DirectChatDetailsSchema,
  GroupChatDetailsSchema
])

export type ChatDetails = z.infer<typeof ChatDetailsSchema>
export type Chat = z.infer<typeof ChatSchema>
