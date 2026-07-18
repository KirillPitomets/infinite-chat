import z from 'zod';

export const createLinkSchema = z.object({
  url: z.string().url(),
  title: z.string(),
});

export type CreateLinkDto = z.infer<typeof createLinkSchema>;
