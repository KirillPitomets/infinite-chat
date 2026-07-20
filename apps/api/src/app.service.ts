import { Injectable } from '@nestjs/common';
import { PrismaService } from './infra/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHello(): Promise<Array<unknown>> {
    const users = await this.prismaService.user.findMany();
    return users;
  }
}
