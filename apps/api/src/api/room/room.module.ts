import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserModule } from '../user/user.module';
import { RoomRepository } from './repositories/room.repository';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomRepository],
  imports: [UserModule],
})
export class RoomModule {}
