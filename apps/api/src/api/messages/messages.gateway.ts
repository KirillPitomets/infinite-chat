import { verifyToken } from '@clerk/backend';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { instanceToPlain } from 'class-transformer';
import { WsExceptionFilter } from 'src/common/filters';
import { flattenValidationErrors } from 'src/utils/flattenValidationErrors.util';
import { WsAuthGuard } from '../auth/guards';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { RestoreMessageDto } from './dto/restore-message.dto';
import { MessageEntity } from './entity/message.entity';
import {
  ClientMessageEvents,
  MessageEvent,
  MessagePayload,
} from './events/messages.events';
import { MessagesService } from './messages.service';
import type {
  MessageServer,
  MessageSocket,
  ServerToClientEvents,
} from './types/message-socket.type';

@WebSocketGateway({
  namespace: 'messages',
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
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: MessageServer;

  constructor(
    private readonly userService: UserService,
    private readonly messagesService: MessagesService,
    private readonly configService: ConfigService,
    private readonly roomService: RoomService,
  ) {}

  async handleConnection(client: MessageSocket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    try {
      if (!token) {
        throw new WsException('Token not provided');
      }

      const payload = await verifyToken(token, {
        secretKey: this.configService.getOrThrow('CLERK_SECRET_KEY'),
      });

      const user = await this.userService.findByClerkId(payload.sub);

      if (!user) {
        throw new WsException('User not found');
      }

      client.data.auth = { user };

      const roomIds = await this.roomService.findUserRoomIds(user.id);
      client.join(roomIds.map(({ roomId }) => roomId));
    } catch (error) {
      client.emit('exception', {
        status: 'error',
        error,
        timestamp: new Date().toISOString(),
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: MessageSocket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage(ClientMessageEvents.SEND)
  async create(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() dto: CreateMessageDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId } = dto;
    if (!client.rooms.has(dto.roomId)) {
      throw new WsException('User not a member of this room');
    }

    const message = await this.messagesService.create(userId, roomId, dto);

    this.emitToRoom(dto.roomId, 'message.created', message);
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

    this.server.to(roomId).emit(event, payload);
  }
}
