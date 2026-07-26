import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';

@Module({
  imports: [DevModule],
  exports: [DevModule],
})
export class ApiModule {}
