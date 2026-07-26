import { type ClerkClient } from '@clerk/backend';
import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators';
import { CLERK_PROVIDE_NAME } from 'src/providers/clerk-client.provider';
import { DevService } from './dev.service';
import { ConfigService } from '@nestjs/config';
import { isDev } from 'src/utils/is-dev.util';

@Controller('dev')
export class DevController {
  constructor(
    @Inject(CLERK_PROVIDE_NAME)
    private readonly clerkClient: ClerkClient,
    private readonly devService: DevService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get()
  async echo(@Query('userId') userId: string) {
    if (!isDev(this.configService))
      throw new ForbiddenException('Not available in production');

    if (!userId) return 'Invalid user id';

    const session = await this.clerkClient.sessions.createSession({ userId });
    const { jwt } = await this.clerkClient.sessions.getToken(session.id);

    return { jwt };
  }
}
