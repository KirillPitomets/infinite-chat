import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserEntity } from './entity';
import { LimitPageQueryDto } from 'src/common/dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async findByClerkId(clerkId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User by clerk Id not found');
    }

    return new UserEntity(user);
  }

  async findAll(
    userId: string,
    query: LimitPageQueryDto,
  ): Promise<UserEntity[]> {
    const { limit, page } = query;

    const users = await this.prismaService.user.findMany({
      take: limit,
      skip: page * limit,
      where: { NOT: { id: userId } },
    });

    return users;
  }
}
