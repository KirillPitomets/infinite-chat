import { Module } from '@nestjs/common';
import { ClerkModule } from 'src/infra/clerk/clerk.module';
import { IS_DEV } from 'src/utils/is-dev.util';
import { DevController } from './dev.controller';

@Module({
  controllers: IS_DEV ? [DevController] : [],
  imports: [ClerkModule],
})
export class DevModule {}
