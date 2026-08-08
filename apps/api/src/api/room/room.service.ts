import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserService } from '../user/user.service';
import {
  CreateGroupRoomDto,
  FindOrCreateDirectRoomDto,
  UpdateGroupAvatarDto,
  UpdateGroupNameDto,
} from './dto';
import { RoomEntity } from './entities';
import { RoomRepository } from './repositories/room.repository';
import { LimitPageQueryDto } from 'src/common/dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomRepo: RoomRepository,
  ) {}

  async findOrCreateDirect(
    userId: string,
    dto: FindOrCreateDirectRoomDto,
  ): Promise<RoomEntity> {
    const member = await this.prismaService.user.findUnique({
      where: { id: dto.memberId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.id === userId) {
      throw new BadRequestException('You cannot create room with yourself');
    }

    const existingRoom = await this.roomRepo.findDirectRoom(userId, member.id);

    if (existingRoom) return new RoomEntity(existingRoom);

    const room = await this.roomRepo.createDirectRoom(userId, member.id);

    return new RoomEntity(room);
  }

  async createGroup(
    userId: string,
    dto: CreateGroupRoomDto,
  ): Promise<RoomEntity> {
    const { memberIds, name } = dto;

    if (memberIds.includes(userId)) {
      throw new BadRequestException('You cannot create room with yourself');
    }

    const validMembers = await this.prismaService.user.findMany({
      where: { id: { in: memberIds } },
    });

    if (validMembers.length !== memberIds.length) {
      throw new BadRequestException('Some member IDs not exist');
    }

    const room = await this.roomRepo.createGroupRoom({
      userId,
      name,
      memberships: validMembers,
    });

    return new RoomEntity(room);
  }

  async findByIdUserRoom(userId: string, roomId: string): Promise<RoomEntity> {
    const room = await this.roomRepo.findByIdUserRoom(userId, roomId);

    if (!room) {
      throw new NotFoundException('Room with ID not found');
    }

    return new RoomEntity(room);
  }

  async findAllUserRooms(
    userId: string,
    query: LimitPageQueryDto,
  ): Promise<RoomEntity[]> {
    const { limit, page } = query;
    const rooms = await this.roomRepo.findAllUserRooms(userId, limit, page);
    return rooms.map((room) => new RoomEntity(room));
  }

  async updateGroupName(
    userId: string,
    roomId: string,
    dto: UpdateGroupNameDto,
  ): Promise<RoomEntity> {
    const { name } = dto;

    const room = await this.roomRepo.updateGroupName(userId, roomId, name);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return new RoomEntity(room);
  }

  async updateGroupAvatar(
    userId: string,
    roomId: string,
    dto: UpdateGroupAvatarDto,
  ): Promise<RoomEntity> {
    const { url, publicId } = dto;

    const room = await this.roomRepo.updateGroupAvatar(
      userId,
      roomId,
      url,
      publicId,
    );

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return new RoomEntity(room);
  }

  async kickMember(
    userId: string,
    roomId: string,
    memberId: string,
  ): Promise<void> {
    if (userId === memberId) {
      throw new BadRequestException('You cannot kick yourself');
    }

    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        id: memberId,
        roomId,
      },
    });

    if (!roomMember) {
      throw new NotFoundException('Member are not in the room');
    }

    // TODO: replace this condition on roleService.isOwner(roomMember.role)
    if (roomMember.role === 'OWNER') {
      throw new BadRequestException('You cannot kick room owner');
    }

    await this.prismaService.roomMember.update({
      where: { id: roomMember.id },
      data: { leftAt: new Date() },
    });
  }

  async leave(userId: string, roomId: string): Promise<void> {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        userId,
        roomId,
      },
      include: {
        room: { select: { type: true } },
      },
    });

    if (!roomMember) {
      throw new NotFoundException('You are not in this room');
    }

    if (roomMember.room.type === 'DIRECT') {
      throw new BadRequestException('You cannot leave from Direct room');
    }

    // TODO: replace this condition on roleService.isOwner(roomMember.role)
    if (roomMember.role === 'OWNER') {
      throw new BadRequestException('You cannot leave from your group');
    }

    await this.prismaService.roomMember.update({
      where: { id: roomMember.id },
      data: { leftAt: new Date() },
    });
  }

  async delete(userId: string, roomId: string): Promise<void> {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: { roomId, userId },
      include: { room: true },
    });

    if (!roomMember) {
      throw new NotFoundException('Room with ID not found');
    }

    if (roomMember.room.type === 'GROUP' && roomMember.role !== 'OWNER') {
      throw new ForbiddenException('Only the owner can delete group room');
    }

    await this.prismaService.room.delete({
      where: { id: roomMember.room.id },
    });
  }

  async assertUserInRoom(userId: string, roomId: string) {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        userId,
        roomId,
      },
    });

    if (!roomMember || roomMember.leftAt) {
      throw new ForbiddenException('User are not room member');
    }

    return true;
  }
}
