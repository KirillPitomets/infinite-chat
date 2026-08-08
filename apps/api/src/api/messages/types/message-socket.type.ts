import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io';
import { socketAuthData } from 'src/types/socket/socketAuthData.type';
import {
  ClientToServerMessageEvents,
  ServerToClientMessageEvents,
} from '../events/messages.events';
import {
  ClientToServerRoomEvents,
  ServerToClientRoomEvents,
} from '../events/room.events';

export interface ServerToClientEvents
  extends ServerToClientMessageEvents, ServerToClientRoomEvents {
  exception: (payload: {
    status: string;
    error: unknown;
    timestamp: string;
  }) => void;
}

export interface ClientToServerEvents
  extends ClientToServerMessageEvents, ClientToServerRoomEvents {}

export type MessageSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  socketAuthData
>;
export type MessageServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  socketAuthData
>;
