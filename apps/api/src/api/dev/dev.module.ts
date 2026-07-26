import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { IS_DEV } from 'src/utils/is-dev.util';

@Module({
  controllers: IS_DEV ? [DevController] : [],
  providers: [DevService, ClerkClientProvider],
})
export class DevModule {}
