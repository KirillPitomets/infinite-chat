import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiGetAll } from './docs/get-all.doc';
import { ApiGetById } from './docs/get-by-id.doc';
import { LimitQueryDto } from './dto/limit-query.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

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
  async findAll(@Query() query: LimitQueryDto): Promise<UserEntity[]> {
    return this.userService.findAll(query.limit);
  }
}
