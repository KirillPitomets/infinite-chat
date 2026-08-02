import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserModule } from '../user/user.module';
import { RoomRepository } from './repositories/room.repository';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';
import { GroupRoomController } from './group-room.controller';

@Module({
  controllers: [RoomController, GroupRoomController],
  providers: [RoomService, RoomRepository],
  imports: [UserModule, CloudinaryModule],
})
export class RoomModule {}
