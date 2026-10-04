import { ExceptionEvents } from 'src/types/socket/ws-exception.type';
import { TypingDto } from '../dto/typing.dto';

export interface ServerToClientPresenceEvents extends ExceptionEvents {
  'presence.typing': ({
    chatRoomId,
    userId,
  }: {
    chatRoomId: string;
    userId: string;
  }) => void;
  'presence.online': (userId: string) => void;
  'presence.offline': (userId: string) => void;
}

export interface ClientToServerPresenceEvents {
  'presence.typing': (dto: TypingDto) => void;
  'presence.heartbeat': () => void;
}

export const ClientPresenceEvents = {
  TYPING: 'presence.typing',
  HEARTBEAT: 'presence.heartbeat',
} satisfies Record<string, keyof ClientToServerPresenceEvents>;

export type ServerPresenceEvents = keyof ServerToClientPresenceEvents;
