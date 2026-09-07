import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ClerkUserId } from 'src/common/decorators';
import { LimitPageQueryDto } from 'src/common/dto';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { type User } from 'src/generated/prisma/client';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import {
  ApiGetMessageHistory,
  ApiGetUnreadCount,
  ApiPresignAttachments,
} from './docs';
import { MessagesService } from './messages.service';

@Controller('/message')
export class MessagesController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly messageService: MessagesService,
  ) {}

  @ApiGetMessageHistory()
  @Get('/history/:roomId')
  async getHistory(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
    @Query() query: LimitPageQueryDto,
  ) {
    return this.messageService.getHistory(user.id, roomId, query);
  }

  @ApiGetUnreadCount()
  @Get('/unread-count/:roomId')
  async getUnreadCount(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ) {
    return this.messageService.getUnreadCount(user.id, roomId);
  }

  @ApiPresignAttachments()
  @Post('/attachments/presign/:roomId')
  async presignAttachments(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ) {
    return this.cloudinaryService.getMessageAttachmentSignature(
      user.id,
      roomId,
    );
  }
}
