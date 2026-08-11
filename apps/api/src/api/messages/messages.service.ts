import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LimitPageQueryDto } from 'src/common/dto';
import { Message } from 'src/generated/prisma/client';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AttachmentsService } from '../attachments/attachments.service';
import { RoomService } from '../room/room.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { MessageEntity } from './entity';
import { MessageRepository } from './repositories/message.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageRepo: MessageRepository,
    private readonly roomService: RoomService,
    private readonly attachmentsService: AttachmentsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getHistory(
    userId: string,
    roomId: string,
    query: LimitPageQueryDto,
  ): Promise<MessageEntity[]> {
    await this.roomService.assertUserInRoom(userId, roomId);

    const { limit, page } = query;

    const messages = await this.messageRepo.getHistory(roomId, limit, page);

    return messages.map((msg) => new MessageEntity(msg));
  }

  async create(
    userId: string,
    roomId: string,
    dto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const { text, attachments, replyToMessageId } = dto;

    await this.roomService.assertUserInRoom(userId, roomId);

    if (!text && (!attachments || attachments.length === 0)) {
      throw new BadRequestException('Message must have text or attachments');
    }

    if (attachments && attachments.length) {
      await this.attachmentsService.ensureAttachmentKeysAreUnique(
        attachments.map((att) => att.key),
      );
    }

    const replyMessage = replyToMessageId
      ? await this.findReplyMessage(replyToMessageId, roomId)
      : null;

    const message = await this.messageRepo.create(
      roomId,
      userId,
      attachments ?? [],
      text,
      replyMessage?.id,
    );

    return new MessageEntity(message);
  }

  async update(userId: string, dto: UpdateMessageDto): Promise<MessageEntity> {
    const { messageId, roomId, text, attachments, replyToMessageId } = dto;
    await this.roomService.assertUserInRoom(userId, roomId);

    if (text === undefined && attachments === undefined) {
      throw new BadRequestException('Message must have text or attachments');
    }

    await this.ensureMessageWillHaveContent(messageId, dto);

    const replyMessage = replyToMessageId
      ? await this.findReplyMessage(replyToMessageId, roomId)
      : null;

    if (replyMessage && replyMessage.id === messageId) {
      throw new BadRequestException('Message cannot reply on itself');
    }

    const updatedMessage = await this.messageRepo.updateMessage(
      messageId,
      text,
      replyToMessageId === null ? null : replyMessage?.id,
      attachments,
    );

    return new MessageEntity(updatedMessage);
  }

  async delete(
    userId: string,
    roomId: string,
    messageId: string,
  ): Promise<MessageEntity> {
    await this.roomService.assertUserInRoom(userId, roomId);

    const message = await this.messageRepo.delete(userId, roomId, messageId);

    return new MessageEntity(message);
  }

  async restore(
    userId: string,
    roomId: string,
    messageId: string,
  ): Promise<MessageEntity> {
    await this.roomService.assertUserInRoom(userId, roomId);

    const message = await this.messageRepo.restore(userId, roomId, messageId);

    return new MessageEntity(message);
  }

  async findReplyMessage(
    replyToMessageId: string,
    roomId: string,
  ): Promise<Message | null> {
    const replyMessage = await this.prismaService.message.findFirst({
      where: {
        id: replyToMessageId,
        roomId,
      },
    });

    if (replyMessage && replyMessage.roomId !== roomId) {
      throw new ConflictException('Cannot reply to message from another room');
    }

    return replyMessage ? replyMessage : null;
  }

  async getOrThrowMessageById(id: string) {
    const message = await this.prismaService.message.findUnique({
      where: {
        id,
      },
      include: {
        attachments: true,
        replyToMessage: true,
        sender: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message for edit not found');
    }

    return message;
  }

  async ensureMessageWillHaveContent(messageId: string, dto: UpdateMessageDto) {
    const message = await this.getOrThrowMessageById(messageId);

    if (
      (dto.text === null && message.attachments.length === 0) ||
      (message.text === null &&
        (dto.attachments === null || dto.attachments?.length === 0))
    ) {
      throw new BadRequestException('Message must have text or attachments');
    }
  }
}
