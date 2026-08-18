import { ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { flattenValidationErrors } from 'src/utils';

export const WsExceptionPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory(errors) {
    const messages: string[] = flattenValidationErrors(errors);
    return new WsException(
      messages.length ? messages.join(', ') : 'Validation failed',
    );
  },
});
