import { Exclude, Type } from 'class-transformer';
import { UserEntity } from 'src/api/user/entity';
import { Prisma } from 'src/generated/prisma/browser';
import { Message, MessageType } from 'src/generated/prisma/client';
import { MessageAttachmentEntity } from './message-attachment.entity';
import { ReplyMessageEntity } from './reply-message.entity';
import { type JsonValue } from '@prisma/client/runtime/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({
    description: 'Unique message identifier (uuid)',
    example: 'd8c2b7e1-8f4b-4b2a-9e1d-3c8f5a6b7c8d',
  })
  id: string;

  @ApiPropertyOptional({
    description:
      'Text content of the message. Nullable for attachment-only messages.',
    example: 'Hello! Check out this document.',
    nullable: true,
  })
  text: string | null;

  @ApiProperty({
    description: 'User who sent the message',
    type: () => UserEntity,
  })
  @Type(() => UserEntity)
  sender: UserEntity;

  @ApiPropertyOptional({
    description: 'Parent message being replied to, if applicable',
    type: () => ReplyMessageEntity,
    nullable: true,
  })
  @Type(() => ReplyMessageEntity)
  replyToMessage?: ReplyMessageEntity | null = null;

  @ApiProperty({
    description: 'List of files or media attached to the message',
    type: () => [MessageAttachmentEntity],
  })
  @Type(() => MessageAttachmentEntity)
  attachments: MessageAttachmentEntity[] = [];

  @ApiProperty({
    description: 'Type of the message',
    enum: MessageType,
    example: MessageType.USER,
  })
  type: MessageType;

  @ApiPropertyOptional({
    description: 'Arbitrary JSON metadata associated with the message',
    example: { key: 'value' },
    nullable: true,
  })
  metadata: Prisma.JsonValue;

  @ApiPropertyOptional({
    description:
      'System-generated text/content for system events (e.g. user joined)',
    example: 'User joined the room',
    nullable: true,
  })
  systemContent: string | null;

  @ApiProperty({
    description: 'Flag indicating whether the message has been soft-deleted',
    example: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'Timestamp when the message was created',
    example: '2026-03-30T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the message was last updated',
    example: '2026-03-30T12:00:00.000Z',
  })
  updatedAt: Date;

  @Exclude() senderId: string;
  @Exclude() roomId: string;
  @Exclude() replyToMessageId: string | null;

  constructor(message: MessageWithRelations) {
    Object.assign(this, message);

    if (message.replyToMessage) {
      this.replyToMessage = new ReplyMessageEntity(message.replyToMessage);
    } else {
      this.replyToMessage = null;
    }

    if (message.attachments) {
      this.attachments = message.attachments.map(
        (att) => new MessageAttachmentEntity(att),
      );
    }

    if (message.sender) {
      this.sender = new UserEntity(message.sender);
    }
  }
}
