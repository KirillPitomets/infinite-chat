import { ExceptionEvents } from '../../../types/socket/ws-exception.type';
import { CreateMessageDto, UpdateMessageDto } from '../dto';
import { DeleteMessageDto } from '../dto/delete-message.dto';
import { RestoreMessageDto } from '../dto/restore-message.dto';
import { MessageEntity } from '../entity';

export type MessagePayload = Omit<
  MessageEntity,
  'senderId' | 'roomId' | 'replyToMessageId'
>;

export interface ServerToClientMessageEvents extends ExceptionEvents {
  'message.created': (message: MessagePayload) => void;
  'message.updated': (message: MessagePayload) => void;
  'message.deleted': (message: MessagePayload) => void;
  'message.restored': (message: MessagePayload) => void;
}

export interface ClientToServerMessageEvents {
  'message.send': (dto: CreateMessageDto) => MessageEntity;
  'message.update': (dto: UpdateMessageDto) => MessageEntity;
  'message.delete': (dto: DeleteMessageDto) => MessageEntity;
  'message.restore': (dto: RestoreMessageDto) => MessageEntity;
}

export const ClientMessageEvents = {
  SEND: 'message.send',
  UPDATE: 'message.update',
  DELETE: 'message.delete',
  RESTORE: 'message.restore',
} satisfies Record<string, keyof ClientToServerMessageEvents>;

export type ServerMessageEvents = keyof ServerToClientMessageEvents;
