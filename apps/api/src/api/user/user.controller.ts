import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiGetAll } from './docs/get-all.doc';
import { ApiGetById } from './docs/get-by-id.doc';
import { UserService } from './user.service';
import { UserEntity } from './entity';
import { LimitPageQueryDto } from 'src/common/dto';

@ApiExtraModels(UserEntity)
@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @ApiGetById()
  @Get('/:id')
  async findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @ApiGetAll()
  @Get('/')
  async findAll(@Query() query: LimitPageQueryDto): Promise<UserEntity[]> {
    return this.userService.findAll(query);
  }
}
