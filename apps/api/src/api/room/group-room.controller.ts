import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClerkUserId } from 'src/common/decorators';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { type User } from 'src/generated/prisma/client';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { Role } from './decorators/role.decorator';
import {
  ApiCreateGroupRoom,
  ApiKickMember,
  ApiLeaveRoom,
  ApiPresignGroupAvatar,
  ApiUpdateGroupAvatar,
  ApiUpdateGroupName,
} from './docs';
import {
  CreateGroupRoomDto,
  UpdateGroupAvatarDto,
  UpdateGroupNameDto,
} from './dto';
import { RoomEntity } from './entities';
import { RoleGuard } from './guards/role.guard';
import { RoomService } from './room.service';
import { ApiRoleGuardResponse } from './docs/api-role-guard.doc';

@ApiTags('Room Group')
@UseGuards(RoleGuard)
@Controller('room/group')
export class GroupRoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiCreateGroupRoom()
  @Post()
  async findOrCreateGroup(
    @ClerkUserId(UserByIdPipe) user: User,
    @Body() dto: CreateGroupRoomDto,
  ): Promise<RoomEntity> {
    return this.roomService.createGroup(user.id, dto);
  }

  @ApiUpdateGroupName()
  @ApiRoleGuardResponse('ADMIN')
  @Role('ADMIN')
  @Patch(':roomId/name')
  async updateName(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateGroupNameDto,
  ) {
    return this.roomService.updateGroupName(user.id, roomId, dto);
  }

  @ApiPresignGroupAvatar()
  @ApiRoleGuardResponse('ADMIN')
  @Role('ADMIN')
  @Post(':roomId/avatar/presign')
  async presignAvatar(@Param('roomId') roomId: string) {
    return this.cloudinaryService.getGroupRoomAvatarSignature(roomId);
  }

  @ApiUpdateGroupAvatar()
  @ApiRoleGuardResponse('ADMIN')
  @Role('ADMIN')
  @Patch(':roomId/avatar')
  async updateAvatar(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateGroupAvatarDto,
  ) {
    return this.roomService.updateGroupAvatar(user.id, roomId, dto);
  }

  @ApiKickMember()
  @ApiRoleGuardResponse('ADMIN')
  @Role('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':roomId/kick/:memberId')
  async kickMember(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.roomService.kickMember(user.id, roomId, memberId);
  }

  @ApiLeaveRoom()
  @Delete('/leave/:roomId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.leave(user.id, roomId);
  }
}
