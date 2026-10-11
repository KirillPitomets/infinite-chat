import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, template: any) {
    const notification = await this.prismaService.notification.create({
      data: {
        userId: userId,
        entityId: '',

        title: '',
        body: '',
        type: '',
        metadata: '',

        category: 'CHAT',
      },
    });
  }
}
