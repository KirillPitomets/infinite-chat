import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';
import { UserModule } from './user/user.module';
import { ClerkWebhookModule } from './webhooks/clerk/clerkWebhook.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [DevModule, UserModule, ClerkWebhookModule, RoomModule],
  exports: [DevModule],
})
export class ApiModule {}
