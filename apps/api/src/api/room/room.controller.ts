import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClerkUserId } from 'src/common/decorators';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { type User } from 'src/generated/prisma/client';
import {
  ApiDeleteRoom,
  ApiFindOrCreateDirectRoom,
  ApiFindRoomById,
  ApiFindUserRooms,
} from './docs';
import { FindOrCreateDirectRoomDto } from './dto';
import { RoomEntity } from './entities';
import { RoleGuard } from './guards/role.guard';
import { RoomService } from './room.service';
import { LimitPageQueryDto } from 'src/common/dto';
import { type Response } from 'express';

@UseGuards(RoleGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiFindOrCreateDirectRoom()
  @Post('/direct')
  async findOrCreateDirect(
    @Res({ passthrough: true }) res: Response,
    @ClerkUserId(UserByIdPipe)
    user: User,
    @Body() dto: FindOrCreateDirectRoomDto,
  ): Promise<RoomEntity> {
    const { entity, created } = await this.roomService.findOrCreateDirect(
      user.id,
      dto,
    );

    res.status(created ? HttpStatus.CREATED : HttpStatus.OK);

    return entity;
  }

  @ApiFindRoomById()
  @Get(':roomId')
  async findById(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ): Promise<RoomEntity> {
    return this.roomService.findByIdUserRoom(user.id, roomId);
  }

  @ApiFindUserRooms()
  @Get()
  async findAll(
    @ClerkUserId(UserByIdPipe) user: User,
    @Query() query: LimitPageQueryDto,
  ): Promise<RoomEntity[]> {
    return this.roomService.findAllUserRooms(user.id, query);
  }

  // @Put(':roomId/read')
  // async updateUserLastRead() {}

  @ApiDeleteRoom()
  @Delete(':roomId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.delete(user.id, roomId);
  }
}
