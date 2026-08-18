import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class RoomAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async assertUserInRoom(userId: string, roomId: string) {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        userId,
        roomId,
      },
    });

    if (!roomMember || roomMember.leftAt) {
      throw new ForbiddenException('User are not room member');
    }

    return true;
  }
}
