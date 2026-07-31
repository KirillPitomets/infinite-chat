import { type ClerkClient } from '@clerk/backend';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLERK_CLIENT } from 'src/infra/clerk/clerk-client.provider';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserEntity } from './entity/user.entity';

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

  async findAll(limit: number): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany({
      take: limit,
    });

    return users;
  }
}
