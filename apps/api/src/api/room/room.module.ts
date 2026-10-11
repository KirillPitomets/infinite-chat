import { Module } from '@nestjs/common';
import { TypedEventEmitterModule } from 'src/common/events/typed-event.module';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { GroupRoomController } from './group-room.controller';
import { RoomRepository } from './repositories/room.repository';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { RoomMemberRepository } from './repositories/room-member.repository';

@Module({
  imports: [UserModule, CloudinaryModule, AuthModule, TypedEventEmitterModule],
  controllers: [RoomController, GroupRoomController],
  providers: [RoomService, RoomRepository, RoomMemberRepository, RoomGateway],
  exports: [RoomService],
})
export class RoomModule {}
