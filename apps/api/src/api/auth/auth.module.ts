import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from 'src/infra/clerk/clerk-client.provider';
import { ClerkStrategy } from 'src/common/strategies/clerk.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [ClerkStrategy, ClerkClientProvider],
  exports: [PassportModule],
})
export class AuthModule {}
