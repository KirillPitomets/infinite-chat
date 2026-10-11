import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { SocketAuthData } from 'src/types/socket/socket-auth-data.type';
import {
  ClientToServerPresenceEvents,
  ServerToClientPresenceEvents,
} from '../contracts/presence.socket-contract';

export type PresenceSocket = Socket<
  ClientToServerPresenceEvents,
  ServerToClientPresenceEvents,
  DefaultEventsMap,
  { roomIds: string[] } & SocketAuthData
>;

export type PresenceServer = Server<
  ClientToServerPresenceEvents,
  ServerToClientPresenceEvents,
  DefaultEventsMap,
  { roomIds: string[] } & SocketAuthData
>;
