import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClerkClientProvider } from 'src/infra/clerk/clerk-client.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, ClerkClientProvider],
})
export class UserModule {}
