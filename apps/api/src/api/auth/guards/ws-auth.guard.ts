import { Socket } from 'socket.io';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { socketAuthData } from 'src/types/socket/socketAuthData.type';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket<{}, {}, {}, socketAuthData> = context
      .switchToWs()
      .getClient();
    if (!client.data.auth.user) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
