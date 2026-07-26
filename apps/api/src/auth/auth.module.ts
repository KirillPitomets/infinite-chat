import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { ClekrStrategy } from 'src/common/strategies/clerk.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [ClekrStrategy, ClerkClientProvider],
  exports: [PassportModule],
})
export class AuthModule {}
