import {
  UseGuards,
  Controller,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleGuard } from './guards/role.guard';
import { RoomService } from './room.service';
import { ClerkUserId } from 'src/common/decorators';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { ApiCreateGroupRoom } from './docs';
import { CreateGroupRoomDto } from './dto';
import { RoomEntity } from './entities';
import { type User } from 'src/generated/prisma/client';
import { Role } from './decorators/role.decorator';
import { UpdateGroupImageDto } from './dto/update-group-image.dto';
import { UpdateGroupNameDto } from './dto/update-group-name.dto';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';

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

  @Role('ADMIN')
  @Patch(':roomId/name')
  async updateName(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateGroupNameDto,
  ) {
    return this.roomService.updateGroupName(user.id, roomId, dto);
  }

  @Role('ADMIN')
  @Patch(':roomId/image')
  async updateImage(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateGroupImageDto,
  ) {
    return this.roomService.updateGroupImage(user.id, roomId, dto);
  }

  @Role('ADMIN')
  @Post(':roomId/avatar/presign')
  async presignAvatar(@Param('roomId') roomId: string) {
    return this.cloudinaryService.getGroupRoomImageSignature(roomId);
  }

  @Role('ADMIN')
  @Delete(':roomId/kick/:memberId')
  async kickMember(
    @Param('roomId') roomId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.roomService.kickMember(roomId, memberId);
  }

  @Delete('/leave/:roomId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @ClerkUserId(UserByIdPipe) user: User,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.leave(user.id, roomId);
  }
}
