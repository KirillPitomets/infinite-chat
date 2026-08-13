import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Socket } from 'socket.io';
import { BaseGateway } from 'src/utils';
import { WsAuthService } from '../auth/ws-auth.service';

@WebSocketGateway({
  namespace: '/notifications',
})
export class NotificationGateway
  extends BaseGateway
  implements OnGatewayConnection
{
  constructor(
    private readonly wsAuthService: WsAuthService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async handleConnection(client: Socket) {
    try {
      const user = await this.wsAuthService.authenticate(client);

      client.join(`user:${user.id}`);
    } catch (error) {
      this.disconnectedWithError(client, error);
    }
  }
}
