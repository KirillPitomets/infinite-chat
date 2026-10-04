import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { PresenceService } from './presence.service';
import { Server, Socket } from 'socket.io';
import { BaseGateway } from 'src/utils';
import { WsAuthService } from '../auth/ws-auth.service';
import { RoomService } from '../room/room.service';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/filters';
import { WsAuthGuard } from '../auth/guards';
import { WsExceptionPipe } from 'src/common/pipes/ws-exception.pipe';
import type { PresenceServer, PresenceSocket } from './types/presence.type';
import { instanceToInstance } from 'class-transformer';
import { ClientPresenceEvents } from './contracts/presence.socket-contract';

@WebSocketGateway({
  namespace: 'presence',
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsAuthGuard)
@UsePipes(WsExceptionPipe)
export class PresenceGateway
  extends BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: PresenceServer;

  constructor(
    private readonly presenceService: PresenceService,
    private readonly wsAuthService: WsAuthService,
    private readonly roomService: RoomService,
  ) {
    super();
  }

  private readonly typingRateLimit = new Map<string, number>();
  private readonly heartBeatRateLimit = new Map<string, number>();

  async handleConnection(client: PresenceSocket) {
    try {
      const user = await this.wsAuthService.authenticate(client);

      client.data.auth = { user };

      client.join(`user:${user.id}`);

      const roomIds = await this.roomService.findUserRoomIds(user.id);
      client.data.roomIds = roomIds;
      this.joinToAllClientRooms(client, roomIds);
    } catch (error) {
      this.disconnectedWithError(client, error);
    }
  }

  handleDisconnect(client: PresenceSocket) {
    try {
      for (const key of this.typingRateLimit.keys()) {
        if (key.startsWith(`${client.id}:`)) {
          this.typingRateLimit.delete(key);
        }
      }

      for (const key of this.heartBeatRateLimit.keys()) {
        if (key.startsWith(`${client.id}:`)) {
          this.heartBeatRateLimit.delete(key);
        }
      }

      const user = client.data.auth.user;
      for (const roomId of client.data.roomIds) {
        this.server.to(`room:${roomId}`).emit('presence.offline', user.id);
      }
    } catch (err) {}
  }

  @SubscribeMessage(ClientPresenceEvents.TYPING)
  async handleTyping(
    @ConnectedSocket() client: PresenceSocket,
    @MessageBody() dto: { roomId: string },
  ) {
    const user = client.data.auth.user;
    const { roomId } = dto;

    const roomName = `room:${roomId}`;
    const room = client.rooms.has(roomName);

    if (!room) {
      throw new WsException('You are not a member of this room');
    }

    const key = `${client.id}:${roomId}`;
    const now = Date.now();
    const lastEmit = this.typingRateLimit.get(key) ?? 0;

    if (now - lastEmit < 1_000) {
      return;
    }
    this.typingRateLimit.set(key, now);

    client.broadcast
      .to(roomName)
      .emit('presence.typing', { chatRoomId: roomId, userId: user.id });
  }

  @SubscribeMessage(ClientPresenceEvents.HEARTBEAT)
  async heartBeat(@ConnectedSocket() client: PresenceSocket) {
    const user = client.data.auth.user;

    const key = `${client.id}`;
    const now = Date.now();
    const lastEmit = this.heartBeatRateLimit.get(key) ?? 0;

    if (now - lastEmit < 5_000) {
      return;
    }
    this.heartBeatRateLimit.set(key, now);

    await this.presenceService.updateUserLastSeen(user.id);

    for (const roomId of client.data.roomIds) {
      client.broadcast.to(`room:${roomId}`).emit('presence.online', user.id);
    }
  }
}
