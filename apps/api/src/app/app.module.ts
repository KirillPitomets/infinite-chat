import { ZodError } from 'zod';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  Logger,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  BaseExceptionFilter,
} from '@nestjs/core';
import {
  ZodSerializationException,
  ZodSerializerInterceptor,
  ZodValidationPipe,
} from 'nestjs-zod';
import { ApiModule } from 'src/api/api.module';
import { AuthModule } from 'src/auth/auth.module';
import { ClerkAuthGuard } from 'src/auth/guards/auth.guard';
import { InfraModule } from '../infra/infra.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ClerkAuthGuard },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}

// http-exception.filter
@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();
      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    super.catch(exception, host);
  }
}
