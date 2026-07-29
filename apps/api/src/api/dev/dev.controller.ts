import { type ClerkClient } from '@clerk/backend';
import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/auth/decorators';
import { CLERK_CLIENT } from 'src/infra/clerk/clerk-client.provider';
import { isDev } from 'src/utils/is-dev.util';

@Controller('dev')
export class DevController {
  constructor(
    @Inject(CLERK_CLIENT)
    private readonly clerkClient: ClerkClient,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get()
  async echo(@Query('userId') userId: string) {
    if (!isDev(this.configService))
      throw new ForbiddenException('Not available in production');

    if (!userId) return 'Invalid user id';

    const session = await this.clerkClient.sessions.createSession({ userId });

    const { jwt } = await this.clerkClient.sessions.getToken(
      session.id,
      'jwt-testing',
    );

    return { jwt };
  }
}
