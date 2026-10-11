import { MessageEntity } from '../entity';

export class SystemMessageCreatedEvent {
  message: MessageEntity;
  roomId: string;

  constructor(message: MessageEntity, roomId: string) {
    this.message = message;
    this.roomId = roomId;
  }
}
