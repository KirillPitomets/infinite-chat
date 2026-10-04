import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class PresenceService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUserLastSeen(userId: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { lastSeen: new Date() },
    });
  }
}
