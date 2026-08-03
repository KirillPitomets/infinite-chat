import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

@UseGuards(RoleGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiFindOrCreateDirectRoom()
  @Post('/direct')
  async findOrCreateDirect(
    @ClerkUserId(UserByIdPipe) user: User,
    @Body() dto: FindOrCreateDirectRoomDto,
  ): Promise<RoomEntity> {
    return this.roomService.findOrCreateDirect(user.id, dto);
  }

  @ApiFindRoomById()
  @Get(':roomId')
  async findById(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ): Promise<RoomEntity> {
    return this.roomService.findByIdForUser(user.id, roomId);
  }

  @ApiFindUserRooms()
  @Get()
  async findAll(@ClerkUserId(UserByIdPipe) user: User): Promise<RoomEntity[]> {
    return this.roomService.findAllForUser(user.id);
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
