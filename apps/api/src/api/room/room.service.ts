import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LimitPageQueryDto } from 'src/common/dto';
import { TypedEventEmitterService } from 'src/common/events/typed-event-emitter.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  CreateGroupRoomDto,
  FindOrCreateDirectRoomDto,
  UpdateGroupAvatarDto,
  UpdateGroupNameDto,
  UpdateRoomMemberLastReadAtDto,
} from './dto';
import { RoomEntity } from './entities';
import { RoomRepository } from './repositories/room.repository';
import { RoomMember, RoomMemberRole } from 'src/generated/prisma/client';
import { AppEventMap, AppEventName } from 'src/common/events/event-map';
import { UserService } from '../user/user.service';
import { RoomMemberRepository } from './repositories/room-member.repository';
import { RoomMemberEntity } from './entities/room-member.entity';

@Injectable()
export class RoomService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomRepo: RoomRepository,
    private readonly roomMemberRepo: RoomMemberRepository,
    private readonly userService: UserService,
    private readonly typedEventEmitterService: TypedEventEmitterService,
  ) {}

  async findOrCreateDirect(
    userId: string,
    dto: FindOrCreateDirectRoomDto,
  ): Promise<{ entity: RoomEntity; created: boolean }> {
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

    if (existingRoom)
      return { entity: new RoomEntity(existingRoom), created: false };

    const room = await this.roomRepo.createDirectRoom(userId, member.id);

    this.typedEventEmitterService.emit('room:created', {
      entity: new RoomEntity(room),
      actorId: userId,
      recipientIds: this.getMemberUserIds(room.memberships),
    });

    return { entity: new RoomEntity(room), created: true };
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

    this.typedEventEmitterService.emit('room:created', {
      entity: new RoomEntity(room),
      actorId: userId,
      recipientIds: this.getMemberUserIds(room.memberships),
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

  async addMemberToGroup(roomId: string, newMemberId: string) {
    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (room.type == 'DIRECT') {
      throw new BadRequestException('You cannot add new member in Direct room');
    }

    const newMember = await this.userService.findById(newMemberId);

    if (!newMember) {
      throw new NotFoundException('User not found');
    }

    const existRoomMember = await this.prismaService.roomMember.findFirst({
      where: {
        roomId,
        userId: newMemberId,
      },
      include: { user: true },
    });

    if (existRoomMember) {
      if (existRoomMember.leftAt === null) {
        throw new BadRequestException('This user already in group');
      } else {
        await this.roomMemberRepo.restoreRoomMember(existRoomMember.id);

        this.typedEventEmitterService.emit('room:member-joined', {
          roomMember: new RoomMemberEntity(existRoomMember),
          roomId,
        });

        return;
      }
    }

    const newRoomMember = await this.roomMemberRepo.addRoomMember(
      newMemberId,
      roomId,
    );

    this.typedEventEmitterService.emit('room:member-joined', {
      roomMember: newRoomMember,
      roomId,
    });
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
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        id: memberId,
        roomId,
      },
    });

    if (!roomMember || roomMember.leftAt !== null) {
      throw new NotFoundException('Member are not in the room');
    }

    if (userId === roomMember.userId) {
      throw new BadRequestException('You cannot kick yourself');
    }

    // TODO: replace this condition on roleService.isOwner(roomMember.role)
    if (roomMember.role === 'OWNER') {
      throw new BadRequestException('You cannot kick room owner');
    }

    await this.prismaService.roomMember.update({
      where: { id: roomMember.id },
      data: { leftAt: new Date() },
    });

    this.typedEventEmitterService.emit('room:member-kicked', {
      actorId: userId,
      roomId,
      kickedRoomMember: { userId: roomMember.userId, id: roomMember.id },
    });
  }

  async leave(userId: string, roomId: string): Promise<void> {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: {
        userId,
        roomId,
      },
      include: {
        room: { include: { memberships: true } },
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

    this.typedEventEmitterService.emit('room:member-left', {
      actorId: userId,
      roomId,
    });

    await this.prismaService.roomMember.update({
      where: { id: roomMember.id },
      data: { leftAt: new Date() },
    });
  }

  async delete(userId: string, roomId: string): Promise<void> {
    const roomMember = await this.prismaService.roomMember.findFirst({
      where: { roomId, userId },
      include: { room: { include: { memberships: true } } },
    });

    if (!roomMember) {
      throw new NotFoundException('Room with ID not found');
    }

    if (roomMember.room.type === 'GROUP' && roomMember.role !== 'OWNER') {
      throw new ForbiddenException('Only the owner can delete group room');
    }

    const room = await this.prismaService.room.delete({
      where: { id: roomMember.room.id },
    });

    this.typedEventEmitterService.emit('room:deleted', {
      actorId: userId,
      roomId: room.id,
      recipientIds: this.getMemberUserIds(roomMember.room.memberships),
    });
  }

  async findUserRoomIds(userId: string): Promise<string[]> {
    const rooms = await this.prismaService.roomMember.findMany({
      where: {
        userId,
        leftAt: null,
      },
      select: { roomId: true },
    });

    return rooms.map(({ roomId }) => roomId);
  }

  async updateLastReadAt(userId: string, dto: UpdateRoomMemberLastReadAtDto) {
    const { roomId, lastReadAt } = dto;
    const roomMember = await this.roomMemberRepo.getRoomMember(userId, roomId);

    const incoming = new Date(lastReadAt).getTime();
    const current = new Date(roomMember.lastReadAt).getTime();

    if (incoming <= current) {
      throw new BadRequestException(
        'The incoming lastReadAt timestamp must be newer than the current one.',
      );
    }
    const safeIncoming = new Date(Math.min(incoming, Date.now()));

    const updatedRoomMember = await this.roomMemberRepo.updateLastReadAt(
      roomMember.id,
      safeIncoming,
    );

    return new RoomMemberEntity(updatedRoomMember);
  }

  private getMemberUserIds(memberships: RoomMember[]): string[] {
    return memberships.map(({ userId }) => userId);
  }
}
