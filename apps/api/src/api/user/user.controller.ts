import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  // @Public()
  @Get()
  async syncUser(@UserId() userId: string) {
    return await this.userService.sync(userId);
  }
}
