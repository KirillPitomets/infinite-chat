import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { WsExceptionFilter } from 'src/common/filters';
import { WsExceptionPipe } from 'src/common/pipes/ws-exception.pipe';
import { BaseGateway } from 'src/utils';
import { WsAuthGuard } from '../auth/guards';
import { WsAuthService } from '../auth/ws-auth.service';
import { RoomAuthService } from '../room-auth/room-auth.service';
import {
  ClientMessageEvents,
  MessageEvent,
  MessagePayload,
} from './contracts/messages.socket-contract';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { RestoreMessageDto } from './dto/restore-message.dto';
import { MessageEntity } from './entity/message.entity';
import { SystemMessageCreatedEvent } from './events/SystemMessageCreated.event';
import { MessagesService } from './messages.service';
import type { MessageServer, MessageSocket } from './types/message-socket.type';
import { RoomService } from '../room/room.service';

@WebSocketGateway({
  namespace: 'messages',
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsAuthGuard)
@UsePipes(WsExceptionPipe)
export class MessagesGateway
  extends BaseGateway
  implements OnGatewayConnection
{
  @WebSocketServer() server: MessageServer;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly roomService: RoomService,
    private readonly wsAuthService: WsAuthService,
  ) {
    super();
  }

  async handleConnection(client: MessageSocket) {
    try {
      const user = await this.wsAuthService.authenticate(client);

      client.data.auth = { user };
      const roomIds = await this.roomService.findUserRoomIds(user.id);
      client.join(roomIds.map((id) => `room:${id}`));
    } catch (error) {
      this.disconnectedWithError(client, error);
    }
  }

  @SubscribeMessage(ClientMessageEvents.SEND)
  async create(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() dto: CreateMessageDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId } = dto;

    if (!client.rooms.has(`room:${dto.roomId}`)) {
      throw new WsException('User not a member of this room');
    }

    const message = await this.messagesService.create(userId, roomId, dto);

    this.emitToRoom(dto.roomId, 'message.created', message);
  }

  @OnEvent('message:created')
  async createSystemMessage(payload: SystemMessageCreatedEvent) {
    const { message, roomId } = payload;
    this.emitToRoom(roomId, 'message.created', message);
  }

  @SubscribeMessage(ClientMessageEvents.UPDATE)
  async update(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() dto: UpdateMessageDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId } = dto;

    if (!client.rooms.has(roomId)) {
      throw new WsException('User not a member of this room');
    }

    const message = await this.messagesService.update(userId, dto);

    this.emitToRoom(dto.roomId, 'message.updated', message);
  }

  @SubscribeMessage(ClientMessageEvents.DELETE)
  async delete(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() dto: DeleteMessageDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId, messageId } = dto;

    if (!client.rooms.has(dto.roomId)) {
      throw new WsException('User not a member of this room');
    }

    const message = await this.messagesService.softDelete(
      userId,
      roomId,
      messageId,
    );

    this.emitToRoom(dto.roomId, 'message.deleted', message);
  }

  @SubscribeMessage(ClientMessageEvents.RESTORE)
  async restore(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() dto: RestoreMessageDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId, messageId } = dto;

    if (!client.rooms.has(dto.roomId)) {
      throw new WsException('User not a member of this room');
    }

    const message = await this.messagesService.restore(
      userId,
      roomId,
      messageId,
    );

    this.emitToRoom(dto.roomId, 'message.restored', message);
  }

  private emitToRoom(
    roomId: string,
    event: MessageEvent,
    message: MessageEntity,
  ) {
    const payload = instanceToPlain(message) as MessagePayload;

    this.server.to(`room:${roomId}`).emit(event, payload);
  }
}
