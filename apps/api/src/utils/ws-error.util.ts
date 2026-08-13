import { Socket } from 'socket.io';

export class BaseGateway {
  protected disconnectedWithError(client: Socket, err: unknown) {
    client.emit('exception', {
      status: 'error',
      error: err || 'Unexpected error, try again later',
      timestamp: new Date().toISOString(),
    });
    client.disconnect();
  }
}
