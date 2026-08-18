import { Module } from '@nestjs/common';
import { RoomAuthService } from './room-auth.service';
import { RoomAuthController } from './room-auth.controller';

@Module({
  controllers: [RoomAuthController],
  providers: [RoomAuthService],
  exports: [RoomAuthService],
})
export class RoomAuthModule {}
