import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { ApiModule } from 'src/api/api.module';
import { InfraModule } from '../infra/infra.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClerkAuthGuard } from 'src/api/auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    ApiModule,
    InfraModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ClerkAuthGuard }],
})
export class AppModule {}
