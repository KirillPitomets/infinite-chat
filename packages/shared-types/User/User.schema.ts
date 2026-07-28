  import { z } from 'zod'

  export const UserSchema = z.object({
    id: z.string(),
    
    firstName: z.string().min(2).max(16),
    lastName: z.string().min(2).max(16),
    username: z.string().min(4).max(64),

    email: z.email({error: "Invalid email address"}),
    imageUrl: z.url(),
    
    createdAt: z.coerce.date().default(() => new Date()),
  });

  export type User = z.infer<typeof UserSchema>;