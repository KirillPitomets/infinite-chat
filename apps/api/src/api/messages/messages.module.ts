import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MessageRepository } from './repositories/message.repository';
import { AttachmentsModule } from '../attachments/attachments.module';

@Module({
  imports: [UserModule, RoomModule, CloudinaryModule, AttachmentsModule],
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService, MessageRepository],
})
export class MessagesModule {}
