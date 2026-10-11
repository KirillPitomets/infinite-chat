import { Module } from '@nestjs/common';
import { RoomListenerModule } from './room/room-listener.module';

@Module({
  imports: [RoomListenerModule],
})
export class ListenerModule {}
