import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [UserModule, RoomModule],
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
