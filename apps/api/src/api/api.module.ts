import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DevModule, UserModule],
  exports: [DevModule],
})
export class ApiModule {}
