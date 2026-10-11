import { Module } from '@nestjs/common';
import { TypedEventEmitterModule } from 'src/common/events/typed-event.module';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';
import { AttachmentsModule } from '../attachments/attachments.module';
import { AuthModule } from '../auth/auth.module';
import { RoomAuthModule } from '../room-auth/room-auth.module';
import { UserModule } from '../user/user.module';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MessageRepository } from './repositories/message.repository';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    UserModule,
    RoomAuthModule,
    CloudinaryModule,
    AttachmentsModule,
    AuthModule,
    TypedEventEmitterModule,
    RoomModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService, MessageRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
