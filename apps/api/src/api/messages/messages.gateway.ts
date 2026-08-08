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
import { WsExceptionFilter } from 'src/common/filters';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { WsAuthGuard } from '../auth/guards';
import { UserService } from '../user/user.service';
import { CreateMessageDto, JoinRoomDto } from './dto';
import { MessagesService } from './messages.service';
import type { MessageServer, MessageSocket } from './types/message-socket.type';
import { flattenValidationErrors } from 'src/utils/flattenValidationErrors.util';
import { instanceToPlain } from 'class-transformer';
import { MessageEntity } from './entity/message.entity';

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
    // TODO remove prisma
    private readonly prismaService: PrismaService,
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
    } catch (error) {
      client.emit('exception', {
        status: 'error',
        error: error ?? 'Unauthorized',
        timestamp: new Date().toISOString(),
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: MessageSocket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('room.join')
  async joinRoom(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId } = dto;

    const existUser = await this.prismaService.roomMember.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    if (!existUser) {
      throw new WsException('You are not a member of this room');
    }

    await client.join(dto.roomId);

    client.emit('room.joined', { success: true, roomId: dto.roomId });
  }

  // Listening
  @SubscribeMessage('message.send')
  async save(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() dto: CreateMessageDto,
  ) {
    const { id: userId } = client.data.auth.user;
    const { roomId } = dto;

    const message = await this.messagesService.create(userId, roomId, dto);

    if (!client.rooms.has(dto.roomId)) {
      throw new WsException('User not a member of this room');
    }

    this.emitToRoom<MessageEntity>(dto.roomId, 'message.created', message);
  }

  private emitToRoom<T>(roomId: string, emitEvent: string, entity: T) {
    this.server.to(roomId).emit(emitEvent, instanceToPlain(entity));
  }
}
