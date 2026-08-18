import { DefaultEventsMap, Socket } from 'socket.io';
import { User } from 'src/generated/prisma/client';

export type SocketAuthData = {
  auth: { user: User };
};

export type AuthenticatedSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketAuthData
>;
