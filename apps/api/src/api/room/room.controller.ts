import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';

import { ClerkUserId } from 'src/common/decorators';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { type User } from 'src/generated/prisma/client';
import { Role } from './decorators/role.decorator';
import {
  ApiCreateGroupRoom,
  ApiDeleteRoom,
  ApiFindOrCreateDirectRoom,
  ApiFindRoomById,
  ApiFindUserRooms,
} from './docs';
import { CreateGroupRoomDto, FindOrCreateDirectRoomDto } from './dto';
import { RoomEntity } from './entities';
import { RoleGuard } from './guards/role.guard';
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

  @ApiCreateGroupRoom()
  @Post('/group')
  async findOrCreateGroup(
    @ClerkUserId(UserByIdPipe) user: User,
    @Body() dto: CreateGroupRoomDto,
  ): Promise<RoomEntity> {
    return this.roomService.createGroup(user.id, dto);
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

  @Role('ADMIN')
  @Put(':roomId/name')
  async updateName(@ClerkUserId(UserByIdPipe) user: User) {}

  @Role('ADMIN')
  @Put(':roomId/image')
  async updateImage(@ClerkUserId(UserByIdPipe) user: User) {}

  @Role('ADMIN')
  @Delete(':roomId/kick/:memberId')
  async kickMember(
    @Param('roomId') roomId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.roomService.kickMember(roomId, memberId);
  }

  // todo docs
  @Delete('/leave/:roomId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.leave(user.id, roomId);
  }

  @ApiDeleteRoom()
  @Role('OWNER')
  @Delete(':roomId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.delete(user.id, roomId);
  }
}
