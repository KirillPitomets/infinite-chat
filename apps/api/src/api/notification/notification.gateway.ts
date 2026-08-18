import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Server, Socket } from 'socket.io';
import { BaseGateway, flattenValidationErrors } from 'src/utils';
import { WsAuthService } from '../auth/ws-auth.service';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/filters';
import { WsAuthGuard } from '../auth/guards';
import { OnEvent } from '@nestjs/event-emitter';
import { instanceToPlain } from 'class-transformer';
import { AppEventMap } from 'src/common/events/event-map';
import { RoomPayload } from '../room/contracts/room.socket-contracts';

@WebSocketGateway({
  namespace: '/notifications',
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsAuthGuard)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory(errors) {
      const messages: string[] = flattenValidationErrors(errors);
      return new WsException(
        messages.length ? messages.join(', ') : 'Validation failed',
      );
    },
  }),
)
export class NotificationGateway
  extends BaseGateway
  implements OnGatewayConnection
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly wsAuthService: WsAuthService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async handleConnection(client: Socket) {
    try {
      const user = await this.wsAuthService.authenticate(client);
      client.data.auth = { user };
      client.join(`user:${user.id}`);
    } catch (error) {
      this.disconnectedWithError(client, error);
    }
  }

  @OnEvent('room:created')
  async handleRoomCreated(payload: AppEventMap['room:created']) {
    const { actorId, recipientIds } = payload;
    const roomPayload = instanceToPlain(payload.entity) as RoomPayload;

    for (let recipientId of recipientIds) {
      if (actorId === recipientId) return;

      this.server.to(`user:${recipientId}`).emit('room.created', roomPayload);
    }
  }

  @OnEvent('room:deleted')
  async handleRoomDeleted(payload: AppEventMap['room:deleted']) {
    const { actorId, roomId, recipientIds } = payload;

    for (let recipientId of recipientIds) {
      if (actorId === recipientId) return;

      this.server.to(`user:${recipientId}`).emit('room.deleted', { roomId });
    }
  }
}
