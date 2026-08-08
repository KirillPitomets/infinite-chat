import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io';
import { socketAuthData } from 'src/types/socket/socketAuthData.type';

export type MessageSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  socketAuthData
>;
export type MessageServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  socketAuthData
>;
