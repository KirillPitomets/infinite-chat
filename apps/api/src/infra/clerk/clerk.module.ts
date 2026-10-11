import { Module } from '@nestjs/common';
import { ClerkClientProvider } from './clerk-client.provider';

@Module({
  providers: [ClerkClientProvider],
  exports: [ClerkClientProvider],
})
export class ClerkModule {}
