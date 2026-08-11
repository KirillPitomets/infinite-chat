import { Prisma } from 'src/generated/prisma/client';

export const baseMessageIncludes = {
  replyToMessage: {
    include: {
      attachments: true,
      sender: true,
    },
  },
  attachments: true,
  sender: true,
} satisfies Prisma.MessageInclude;
