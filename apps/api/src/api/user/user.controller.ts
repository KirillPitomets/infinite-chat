import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { GetUserByIdResponse } from './dto/getUserByIdResponse.dto';
import { ZodResponse } from 'nestjs-zod';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('/:id')
  @ZodResponse({
    type: GetUserByIdResponse,
  })
  async getById(@Param() id: string): Promise<GetUserByIdResponse> {
    return this.userService.getById(id);
  }

  @Get('/clerk/:id')
  async getByClerkId(@Param() id: string) {}

  @Get('/')
  async getAll() {}
}
