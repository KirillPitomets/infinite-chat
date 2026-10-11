import { SocketAuthData } from 'src/types/socket/socket-auth-data.type';
import {
  ClientToServerRoomEvents,
  ServerToClientRoomEvents,
} from '../contracts/room.socket-contracts';
import { DefaultEventsMap, Server, Socket } from 'socket.io';

export type ServerToClientEvents = ServerToClientRoomEvents;

export type RoomSocket = Socket<
  ClientToServerRoomEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketAuthData
>;

export type RoomServer = Server<
  ClientToServerRoomEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketAuthData
>;
