import { CreateMessageDto, UpdateMessageDto } from '../dto';
import { DeleteMessageDto } from '../dto/delete-message.dto';
import { RestoreMessageDto } from '../dto/restore-message.dto';
import { MessageEntity } from '../entity';

export type MessagePayload = Omit<
  MessageEntity,
  'senderId' | 'roomId' | 'replyToMessageId'
>;

export interface ExceptionPayload {
  status: string;
  error: unknown;
  timestamp: string;
}

export interface ServerToClientMessageEvents {
  'message.created': (message: MessagePayload) => void;
  'message.updated': (message: MessagePayload) => void;
  'message.deleted': (message: MessagePayload) => void;
  'message.restored': (message: MessagePayload) => void;

  exception: (payload: ExceptionPayload) => void;
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
};

export type MessageEvent =
  | 'message.created'
  | 'message.updated'
  | 'message.deleted'
  | 'message.restored';
