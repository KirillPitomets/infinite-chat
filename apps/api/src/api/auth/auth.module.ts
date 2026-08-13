import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from 'src/infra/clerk/clerk-client.provider';
import { ClerkStrategy } from 'src/common/strategies/clerk.strategy';
import { UserModule } from '../user/user.module';
import { WsAuthService } from './ws-auth.service';

@Module({
  imports: [PassportModule, ConfigModule, UserModule],
  providers: [ClerkStrategy, ClerkClientProvider, WsAuthService],
  exports: [PassportModule, WsAuthService],
})
export class AuthModule {}
