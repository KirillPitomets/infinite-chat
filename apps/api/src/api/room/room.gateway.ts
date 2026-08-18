import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { AppEventMap } from 'src/common/events/event-map';
import { WsExceptionFilter } from 'src/common/filters';
import { WsExceptionPipe } from 'src/common/pipes/ws-exception.pipe';
import { BaseGateway } from 'src/utils';
import { WsAuthGuard } from '../auth/guards';
import { WsAuthService } from '../auth/ws-auth.service';
import { RoomPayload } from './contracts/room.socket-contracts';
import type { RoomServer, RoomSocket } from './types/room-socket.type';
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: 'rooms',
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsAuthGuard)
@UsePipes(WsExceptionPipe)
export class RoomGateway extends BaseGateway implements OnGatewayConnection {
  @WebSocketServer() server: RoomServer;

  constructor(
    private readonly wsAuthService: WsAuthService,
    private readonly roomService: RoomService,
  ) {
    super();
  }

  async handleConnection(client: RoomSocket) {
    try {
      const user = await this.wsAuthService.authenticate(client);
      client.data.auth = { user };

      const rooms = await this.roomService.findUserRoomIds(user.id);
      client.join(rooms.map((id) => `room:${id}`));
    } catch (error) {
      this.disconnectedWithError(client, error);
    }
  }

  @OnEvent('room:member-left')
  async handleRoomMemberLeft(payload: AppEventMap['room:member-left']) {
    const { actorId, roomId } = payload;

    this.server.to(`room:${roomId}`).emit('room.member-left', {
      roomId,
      userId: actorId,
    });
  }

  @OnEvent('room:member-kicked')
  async handleRoomMemberKicked(payload: AppEventMap['room:member-kicked']) {
    const { actorId, kickedMemberId, roomId } = payload;
    this.server
      .to(`room:${roomId}`)
      .emit('room.member-kicked', { actorId, kickedMemberId, roomId });
  }
}
