import { User } from 'src/generated/prisma/client';

export type SocketAuthData = {
  auth: { user: User };
};
