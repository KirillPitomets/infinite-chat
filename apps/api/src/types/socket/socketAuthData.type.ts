import { User } from 'src/generated/prisma/client';

export type socketAuthData = {
  auth: { user: User };
};
