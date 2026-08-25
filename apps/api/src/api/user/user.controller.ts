import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiGetAll } from './docs/get-all.doc';
import { ApiGetById } from './docs/get-by-id.doc';
import { UserService } from './user.service';
import { UserEntity } from './entity';
import { LimitPageQueryDto } from 'src/common/dto';
import { ClerkUserId } from 'src/common/decorators';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import type { User } from 'src/generated/prisma/client';
import { ApiGetCurrentUser } from './docs/me.doc';
import { Public } from '../auth/decorators';

@ApiExtraModels(UserEntity)
@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @ApiGetCurrentUser()
  @Get('/me')
  async currentUser(@ClerkUserId(UserByIdPipe) user: User) {
    return new UserEntity(user);
  }

  @ApiGetById()
  @Get('/:id')
  async findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @ApiGetAll()
  @Get()
  async findAll(@Query() query: LimitPageQueryDto): Promise<UserEntity[]> {
    return this.userService.findAll(query);
  }
}
