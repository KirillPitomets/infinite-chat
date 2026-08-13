import { Socket } from 'socket.io';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SocketAuthData } from 'src/types/socket/socket-auth-data.type';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket<{}, {}, {}, SocketAuthData> = context
      .switchToWs()
      .getClient();
    if (!client.data.auth.user) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
