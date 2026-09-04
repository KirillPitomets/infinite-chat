import { PrismaService } from 'src/infra/prisma/prisma.service';
import { activeMembershipsInclude } from './constants/includes';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { RoomEntity } from '../entities';

@Injectable()
export class RoomMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addRoomMember(userId: string, roomId: string) {
    return await this.prisma.roomMember.create({
      data: {
        userId,
        roomId,
      },
      include: {
        room: { include: { memberships: activeMembershipsInclude } },
        user: true,
      },
    });
  }

  async restoreRoomMember(roomMemberId: string) {
    return await this.prisma.roomMember.update({
      where: {
        id: roomMemberId,
      },
      data: {
        leftAt: null,
      },
      include: {
        room: { include: { memberships: activeMembershipsInclude } },
        user: true,
      },
    });
  }

  async getRoomMember(userId: string, roomId: string) {
    const roomMember = await this.prisma.roomMember.findFirst({
      where: {
        userId,
        roomId,
      },
      include: {
        room: { include: { memberships: activeMembershipsInclude } },
        user: true,
      },
    });

    if (!roomMember) {
      throw new ForbiddenException('User are not room member');
    }

    return roomMember;
  }

  async updateLastReadAt(roomMemberId: string, lastReadAt: Date) {
    return await this.prisma.roomMember.update({
      where: { id: roomMemberId },
      data: { lastReadAt },
      include: {
        room: { include: { memberships: activeMembershipsInclude } },
        user: true,
      },
    });
  }
}
