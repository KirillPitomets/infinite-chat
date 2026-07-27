import { type User, type ClerkClient } from '@clerk/backend';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CLERK_CLIENT } from 'src/infra/clerk/clerk-client.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(CLERK_CLIENT)
    private readonly clerkClient: ClerkClient,
    private readonly prismaService: PrismaService,
  ) {}

  async sync(userId: string) {
    const user: User = await this.clerkClient.users.getUser(userId);

    return user;
  }
}

/*
generateTag(name: string) {}

syncUser

getDbUserByClerkId

getById

getAllUsers
*/
