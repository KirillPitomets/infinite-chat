import { Exclude, Type } from 'class-transformer';
import { UserEntity } from 'src/api/user/entity';
import { Message, MessageType, Prisma } from 'src/generated/prisma/client';
import { MessageAttachmentEntity } from './message-attachment.entity';
import { type JsonValue } from '@prisma/client/runtime/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type ReplyMessagePayload = Prisma.MessageGetPayload<{
  include: {
    attachments: true;
    sender: true;
  };
}>;

export class ReplyMessageEntity implements Message {
  @ApiProperty({
    description: 'Unique ID of the referenced message being replied to',
    example: 'd8c2b7e1-8f4b-4b2a-9e1d-3c8f5a6b7c8d',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Text content of the replied message',
    example: 'Original message text',
    nullable: true,
  })
  text: string | null;

  @ApiProperty({
    description: 'Flag indicating whether the replied message was deleted',
    example: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'Author of the replied message',
    type: () => UserEntity,
  })
  @Type(() => UserEntity)
  sender: UserEntity;

  @ApiProperty({
    description: 'List of attachments in the replied message',
    type: () => [MessageAttachmentEntity],
  })
  @Type(() => MessageAttachmentEntity)
  attachments: MessageAttachmentEntity[] = [];

  @ApiProperty({
    description: 'Timestamp when the original message was created',
    example: '2026-03-30T11:55:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the original message was last updated',
    example: '2026-03-30T11:55:00.000Z',
  })
  updatedAt: Date;

  @Exclude() type: MessageType;
  @Exclude() metadata: JsonValue;
  @Exclude() systemContent: string | null;
  @Exclude() replyToMessageId: string | null;
  @Exclude() roomId: string;
  @Exclude() senderId: string;

  constructor(replyMessage: ReplyMessagePayload) {
    Object.assign(this, replyMessage);

    if (replyMessage.sender) {
      this.sender = new UserEntity(replyMessage.sender);
    }

    if (replyMessage.attachments) {
      this.attachments = replyMessage.attachments.map(
        (att) => new MessageAttachmentEntity(att),
      );
    }
  }
}
