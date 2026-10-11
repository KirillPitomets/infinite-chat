import { Module } from '@nestjs/common';
import { RoomEventListener } from './room.listener';
import { MessagesModule } from 'src/api/messages/messages.module';
import { TypedEventEmitterModule } from 'src/common/events/typed-event.module';

@Module({
  imports: [MessagesModule, TypedEventEmitterModule],
  providers: [RoomEventListener],
})
export class RoomListenerModule {}
