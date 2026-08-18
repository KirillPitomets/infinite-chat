import { SocketAuthData } from 'src/types/socket/socket-auth-data.type';
import { ServerToClientRoomEvents } from '../contracts/room.socket-contracts';
import { DefaultEventsMap, Server, Socket } from 'socket.io';

export type ServerToClientEvents = ServerToClientRoomEvents;

export type RoomSocket = Socket<
  DefaultEventsMap,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketAuthData
>;

export type RoomServer = Server<
  DefaultEventsMap,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketAuthData
>;
