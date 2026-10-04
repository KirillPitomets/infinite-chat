import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceGateway } from './presence.gateway';
import { AuthModule } from '../auth/auth.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [AuthModule, RoomModule],
  providers: [PresenceGateway, PresenceService],
})
export class PresenceModule {}
