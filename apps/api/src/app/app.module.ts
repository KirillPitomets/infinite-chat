import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InfraMoule } from '../infra/infta.module';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from 'src/auth/guards/auth.guard';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [
    ApiModule,
    InfraMoule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    { provide: APP_GUARD, useClass: ClerkAuthGuard },
  ],
})
export class AppModule {}
