import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserEntity } from '../user/entity';
import { UserService } from '../user/user.service';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class WsAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async authenticate(client: Socket): Promise<UserEntity> {
    const token = client.handshake.headers.authorization?.split(' ')[1];

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

    return user;
  }
}
