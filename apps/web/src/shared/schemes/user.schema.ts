import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  tag: z.string(),
  email: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;