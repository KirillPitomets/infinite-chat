import z from "zod";

const BaseChatDetailsSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
});

const DirectChatDetailsSchema = BaseChatDetailsSchema.extend({
  type: z.literal("DIRECT"),
  otherUser: z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    imageUrl: z.string(),
  }),
});

const GroupChatDetailsSchema = BaseChatDetailsSchema.extend({
  type: z.literal("GROUP"),
  name: z.string(),
  membersCount: z.number(),
  imageUrl: z.string(),
});

export const ChatDetailsSchema = z.union([
  DirectChatDetailsSchema,
  GroupChatDetailsSchema,
]);

export type ChatDetailsDTO = z.infer<typeof ChatDetailsSchema>;