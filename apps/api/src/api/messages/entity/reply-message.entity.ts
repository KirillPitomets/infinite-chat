import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/api/user/entity';
import { Message, Prisma } from 'src/generated/prisma/client';
import { MessageAttachmentEntity } from './message-attachment.entity';

type ReplyMessagePayload = Prisma.MessageGetPayload<{
  include: {
    attachments: true;
    sender: true;
  };
}>;

export class ReplyMessageEntity implements Message {
  id: string;
  text: string | null;
  isDeleted: boolean;

  sender: UserEntity;
  attachments: MessageAttachmentEntity[] = [];

  createdAt: Date;
  updatedAt: Date;

  @Exclude() replyToMessageId: string | null;
  @Exclude() roomId: string;
  @Exclude() senderId: string;

  constructor(replyMessage: ReplyMessagePayload) {
    Object.assign(this, replyMessage);

    this.sender = new UserEntity(replyMessage.sender);
    this.attachments = replyMessage.attachments.map(
      (att) => new MessageAttachmentEntity(att),
    );
  }
}
