import { type ClerkClient } from '@clerk/backend';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLERK_CLIENT } from 'src/infra/clerk/clerk-client.provider';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { GetUserByIdResponse } from './dto/getUserByIdResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(CLERK_CLIENT)
    private readonly clerkClient: ClerkClient,
    private readonly prismaService: PrismaService,
  ) {}

  async getById(id: string): Promise<GetUserByIdResponse> {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (user) return user;

    throw new NotFoundException('User not found');
  }

  async getByClerkId(id: string) {}

  async getAll() {}
}
