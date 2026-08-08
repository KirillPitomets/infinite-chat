import { CreateMessageDto } from '../dto';
import { MessageEntity } from '../entity';

export interface ServerToClientMessageEvents {
  'message.created': (message: MessageEntity) => void;
  'message.updated': (message: MessageEntity) => void;
  'message.deleted': (message: MessageEntity) => void;
}

export interface ClientToServerMessageEvents {
  'message.send': (dto: CreateMessageDto) => void;
  'message.update': (dto: CreateMessageDto) => void;
  'message.delete': (dto: CreateMessageDto) => void;
}

export const ClientMessageEvents = {
  SEND: 'message.send',
  UPDATE: 'message.update',
  DELETE: 'message.delete',
};
