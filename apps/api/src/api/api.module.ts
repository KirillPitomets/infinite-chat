import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';
import { UserModule } from './user/user.module';
import { ClerkWebhookModule } from './webhooks/clerk/clerkWebhook.module';
import { RoomModule } from './room/room.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    DevModule,
    UserModule,
    ClerkWebhookModule,
    RoomModule,
    MessagesModule,
    AuthModule,
    AttachmentsModule,
    NotificationModule,
  ],
  exports: [DevModule],
})
export class ApiModule {}
