import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from '../infra/infra.module';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from 'src/auth/guards/auth.guard';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    ApiModule,
    InfraModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ClerkAuthGuard }],
})
export class AppModule {}
