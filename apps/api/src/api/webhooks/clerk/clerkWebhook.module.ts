import { Module } from '@nestjs/common';
import { ClerkWebhookController } from './clerkWebhook.controller';

@Module({
  controllers: [ClerkWebhookController],
})
export class ClerkWebhookModule {}
