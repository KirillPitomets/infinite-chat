import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Message } from 'src/generated/prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { RoomService } from '../room/room.service';
import { CreateMessageDto } from './dto';
import { MessageEntity } from './entity';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomService: RoomService,
  ) {}

  async create(
    userId: string,
    roomId: string,
    dto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const { text, attachments, replyToMessageId } = dto;

    await this.roomService.assertUserInRoom(userId, roomId);

    if (!text && (!attachments || attachments.length === 0)) {
      throw new BadRequestException('Message must have content or files');
    }

    let replyMessage: Message | null = null;

    if (replyToMessageId) {
      replyMessage = await this.prismaService.message.findFirst({
        where: {
          id: replyToMessageId,
          roomId,
        },
      });

      if (replyMessage && replyMessage.roomId !== roomId) {
        throw new ConflictException(
          'Cannot reply to message from another room',
        );
      }
    }

    const message = await this.prismaService.message.create({
      data: {
        roomId,
        senderId: userId,
        text,
        replyToMessageId: replyMessage ? replyMessage.id : null,
        attachments: attachments?.length
          ? { createMany: { data: attachments } }
          : undefined,
      },
      include: {
        attachments: true,
        sender: true,
        replyToMessage: { include: { sender: true, attachments: true } },
      },
    });

    return new MessageEntity(message);
  }
}
