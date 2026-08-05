import { type ClerkClient } from '@clerk/backend';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLERK_CLIENT } from 'src/infra/clerk/clerk-client.provider';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserEntity } from './entity';
import { LimitPageQueryDto } from 'src/common/dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(CLERK_CLIENT)
    private readonly clerkClient: ClerkClient,
    private readonly prismaService: PrismaService,
  ) {}

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
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async findAll(query: LimitPageQueryDto): Promise<UserEntity[]> {
    const { limit, page } = query;

    const users = await this.prismaService.user.findMany({
      take: limit,
      skip: page * limit,
    });

    return users;
  }
}
