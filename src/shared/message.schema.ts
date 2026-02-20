import z from "zod"

export const ChatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    imageUrl: z.string()
  }),
  isDeleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type ChatMessageDTO = z.infer<typeof ChatMessageSchema>
