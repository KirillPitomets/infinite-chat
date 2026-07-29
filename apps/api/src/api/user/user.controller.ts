import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('/:id')
  async getById(@Param() id: string) {
    return this.userService.getById(id);
  }

  @Get('/clerk/:id')
  async getByClerkId(@Param() id: string) {}

  @Get('/')
  async getAll() {}
}
