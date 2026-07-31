import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { FindOrCreateDirectRoomDto, CreateGroupRoomDto } from './dto';
import { RoomEntity } from './entities';
import { RoomRepository } from './repositories/room.repository';

@Injectable()
export class RoomService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomRepo: RoomRepository,
    private readonly userService: UserService,
  ) {}

  async findOrCreateDirect(
    userId: string,
    dto: FindOrCreateDirectRoomDto,
  ): Promise<RoomEntity> {
    const member = await this.userService.findById(dto.memberId);

    if (member.id === userId) {
      throw new BadRequestException('You can not create chat with yourself');
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
    const { memberIds, name, imageUrl } = dto;

    const validMembers = await this.prismaService.user.findMany({
      where: { id: { in: memberIds } },
    });

    if (validMembers.length !== memberIds.length) {
      throw new BadRequestException('Some member IDs not exist');
    }

    const room = await this.roomRepo.createGroupRoom({
      userId,
      name,
      imageUrl,
      memberships: validMembers,
    });

    return new RoomEntity(room);
  }

  async findByIdForUser(userId: string, roomId: string): Promise<RoomEntity> {
    const room = await this.roomRepo.findByIdForUser(userId, roomId);

    if (!room) {
      throw new NotFoundException('Room with ID not found');
    }

    return new RoomEntity(room);
  }

  async findAllForUser(userId: string): Promise<RoomEntity[]> {
    const rooms = await this.roomRepo.findAllForUser(userId);

    return rooms.map((room) => new RoomEntity(room));
  }

  async kickMember(roomId: string, memberId: string) {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        userId: memberId,
        roomId,
      },
    });

    if (!roomMember) {
      throw new NotFoundException('Member are not in the room');
    }

    await this.prismaService.roomMember.delete({
      where: { id: roomMember.id },
    });

    return true;
  }

  async leave(userId: string, roomId: string) {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        userId,
        roomId,
      },
    });

    if (!roomMember) {
      throw new NotFoundException('You are not in this room');
    }

    await this.prismaService.roomMember.delete({
      where: { id: roomMember.id },
    });

    return true;
  }

  async delete(userId: string, roomId: string) {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: { roomId, userId },
      include: { room: true },
    });

    if (!roomMember) {
      throw new NotFoundException('Room with ID not found');
    }

    if (roomMember.room.type === 'GROUP' && roomMember.role !== 'OWNER') {
      throw new BadRequestException('Only owner can delete room');
    }

    await this.prismaService.room.delete({
      where: { id: roomMember.room.id },
    });

    return true;
  }
}
