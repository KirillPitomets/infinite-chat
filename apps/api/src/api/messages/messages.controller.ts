import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClerkUserId } from 'src/common/decorators';
import { LimitPageQueryDto } from 'src/common/dto';
import { CountPresignQueryDto } from 'src/common/dto/count-presign.dto';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { type User } from 'src/generated/prisma/client';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { PresignedUrlEntity } from 'src/infra/cloudinary/entity/PresignedUrl.entity';
import { MessagesService } from './messages.service';
import { ApiGetMessageHistory, ApiPresignAttachments } from './docs';

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

  @ApiPresignAttachments()
  @Post('/attachments/presign/:roomId')
  async presignAttachments(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
    @Query() query: CountPresignQueryDto,
  ) {
    const { count } = query;
    const presigns: PresignedUrlEntity[] = [];

    for (let i = 0; i < count; i++) {
      const presign = this.cloudinaryService.getMessageAttachmentSignature(
        user.id,
        roomId,
      );
      presigns.push(presign);
    }

    return presigns;
  }
}
