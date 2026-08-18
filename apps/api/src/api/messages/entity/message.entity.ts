import { Exclude, Type } from 'class-transformer';
import { UserEntity } from 'src/api/user/entity';
import { Prisma } from 'src/generated/prisma/browser';
import { Message, MessageType } from 'src/generated/prisma/client';
import { MessageAttachmentEntity } from './message-attachment.entity';
import { ReplyMessageEntity } from './reply-message.entity';
import { type JsonValue } from '@prisma/client/runtime/client';

type MessageWithRelations = Prisma.MessageGetPayload<{
  include: {
    attachments: true;
    sender: true;
    replyToMessage: {
      include: { sender: true; attachments: true };
    };
  };
}>;

export class MessageEntity implements Message {
  id: string;
  text: string | null;

  sender: UserEntity;

  replyToMessage?: ReplyMessageEntity | null = null;
  attachments: MessageAttachmentEntity[] = [];

  type: MessageType;
  metadata: JsonValue;
  systemContent: string | null;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;

  @Exclude() senderId: string;
  @Exclude() roomId: string;
  @Exclude() replyToMessageId: string | null;

  constructor(message: MessageWithRelations) {
    Object.assign(this, message);

    if (message.replyToMessage) {
      this.replyToMessage = new ReplyMessageEntity(message.replyToMessage);
    }

    if (message.attachments) {
      this.attachments = message.attachments.map(
        (att) => new MessageAttachmentEntity(att),
      );
    }
    this.sender = new UserEntity(message.sender);
  }
}
