import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient();

    // Transform exception into structured error
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception instanceof HttpException
          ? exception.message
          : { message: 'Internal server error' };

    // Send error event to the client
    client.emit('exception', {
      status: 'error',
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
