import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io';
import { SocketAuthData } from 'src/types/socket/socket-auth-data.type';
import {
  ServerToClientMessageEvents,
  ClientToServerMessageEvents,
} from '../contracts/messages.socket-contract';

export type ServerToClientEvents = ServerToClientMessageEvents;

export type ClientToServerEvents = ClientToServerMessageEvents;

export type MessageSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketAuthData
>;

export type MessageServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketAuthData
>;
