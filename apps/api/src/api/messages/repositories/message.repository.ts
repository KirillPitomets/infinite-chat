import { Injectable } from '@nestjs/common';
import { AttachmentsService } from 'src/api/attachments/attachments.service';
import {
  CreateMessageAttachmentDto,
  UpdateMessageAttachmentDto,
} from 'src/api/attachments/dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { baseMessageIncludes } from './constants/includes';

@Injectable()
export class MessageRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async getHistory(roomId: string, limit: number, page: number) {
    return await this.prisma.message.findMany({
      where: {
        roomId,
      },
      include: baseMessageIncludes,
      take: limit,
      skip: page * limit,
    });
  }

  async softDelete(userId: string, roomId: string, messageId: string) {
    return this.prisma.message.update({
      where: {
        id: messageId,
        roomId,
        senderId: userId,
      },
      data: {
        isDeleted: true,
      },
      include: baseMessageIncludes,
    });
  }

  async restore(userId: string, roomId: string, messageId: string) {
    return this.prisma.message.update({
      where: {
        id: messageId,
        roomId,
        senderId: userId,
      },
      data: {
        isDeleted: false,
      },
      include: baseMessageIncludes,
    });
  }

  async create(
    roomId: string,
    senderId: string,
    attachments: CreateMessageAttachmentDto[],
    text?: string | null,
    replyMessageId?: string,
  ) {
    return this.prisma.message.create({
      data: {
        roomId,
        senderId,
        text,
        replyToMessageId: replyMessageId ?? null,
        attachments: attachments?.length
          ? { createMany: { data: attachments } }
          : undefined,
      },
      include: baseMessageIncludes,
    });
  }

  async updateMessage(
    userId: string,
    messageId: string,
    text?: string | null,
    replyToMessageId?: string | null,
    attachments?: UpdateMessageAttachmentDto[] | null,
  ) {
    return this.prisma.$transaction(async (tx) => {
      if (text === null || text) {
        await tx.message.update({
          where: { id: messageId, senderId: userId },
          data: { text },
        });
      }

      if (replyToMessageId === null || replyToMessageId) {
        await tx.message.update({
          where: { id: messageId },
          data: { replyToMessageId },
        });
      }

      if (attachments === null) {
        await this.attachmentsService.removeMessageAttachments(messageId);
      }

      if (attachments && attachments.length > 0) {
        await this.attachmentsService.replaceMessageAttachments(
          messageId,
          attachments,
        );
      }

      return await tx.message.findFirstOrThrow({
        where: {
          id: messageId,
        },
        include: baseMessageIncludes,
      });
    });
  }
}
