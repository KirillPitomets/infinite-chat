import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';
import { UserModule } from './user/user.module';
import { ClerkWebhookModule } from './webhooks/clerk/clerkWebhook.module';

@Module({
  imports: [DevModule, UserModule, ClerkWebhookModule],
  exports: [DevModule],
})
export class ApiModule {}
