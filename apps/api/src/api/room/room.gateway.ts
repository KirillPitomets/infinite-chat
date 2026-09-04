import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
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
import {
  ClientRoomEvents,
  RoomMemberPayload,
} from './contracts/room.socket-contracts';
import { UpdateRoomMemberLastReadAtDto } from './dto';
import { RoomService } from './room.service';
import type { RoomServer, RoomSocket } from './types/room-socket.type';
import { RoomMemberEntity } from './entities/room-member.entity';

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

      client.join(`user:${user.id}`);

      const roomIds = await this.roomService.findUserRoomIds(user.id);
      this.joinToAllClientRooms(client, roomIds);
    } catch (error) {
      this.disconnectedWithError(client, error);
    }
  }

  @SubscribeMessage(ClientRoomEvents.updateReadAt)
  async handleUpdateLastReadAt(
    @ConnectedSocket() client: RoomSocket,
    @MessageBody() dto: UpdateRoomMemberLastReadAtDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId } = dto;

    const roomMember = await this.roomService.updateLastReadAt(userId, dto);
    const roomMemberPayload = this.instanceRoomMemberToPlain(roomMember);
    this.server
      .to(`room:${roomId}`)
      .emit('room.updated-member-read-at', roomMemberPayload);
  }

  @OnEvent('room:member-left')
  async handleRoomMemberLeft(payload: AppEventMap['room:member-left']) {
    const { actorId, roomId } = payload;

    this.server.to(`room:${roomId}`).emit('room.member-left', actorId);
    this.leaveRoomForUser(this.server, actorId, roomId);
  }

  @OnEvent('room:member-kicked')
  async handleRoomMemberKicked(payload: AppEventMap['room:member-kicked']) {
    const { actorId, kickedRoomMember, roomId } = payload;
    this.server.to(`room:${roomId}`).emit('room.member-kicked', {
      actorId,
      kickedMemberId: kickedRoomMember.id,
    });

    this.leaveRoomForUser(this.server, kickedRoomMember.userId, roomId);
  }

  @OnEvent('room:member-joined')
  async handleRoomMemberJoined(payload: AppEventMap['room:member-joined']) {
    const { roomMember, roomId } = payload;

    const roomMemberPayload = instanceToPlain(
      payload.roomMember,
    ) as RoomMemberPayload;

    this.server.to(`room:${roomId}`).emit('room.member-joined', roomMember);

    this.addRoomForUser(this.server, roomMember.userId, roomId);
  }

  private instanceRoomMemberToPlain(
    roomMember: RoomMemberEntity,
  ): RoomMemberPayload {
    return instanceToPlain(roomMember) as RoomMemberPayload;
  }
}
