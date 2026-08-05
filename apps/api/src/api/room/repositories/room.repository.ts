import { Injectable } from '@nestjs/common';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { createGroupRoomArgs } from './types/room.repository.types';
import { activeMembershipsInclude } from './constants/includes';

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDirectRoom(userId: string, memberId: string) {
    return this.prisma.room.findFirst({
      where: {
        type: 'DIRECT',
        memberships: { some: { userId: userId, leftAt: null } },
        AND: { memberships: { some: { userId: memberId, leftAt: null } } },
      },
      include: { memberships: activeMembershipsInclude },
    });
  }

  async createDirectRoom(userId: string, memberId: string) {
    return this.prisma.room.create({
      data: {
        type: 'DIRECT',
        createdByUserId: userId,
        memberships: { create: [{ userId: memberId }, { userId: userId }] },
      },
      include: { memberships: activeMembershipsInclude },
    });
  }

  async createGroupRoom({
    userId,
    name,
    memberships,
    avatarUrl,
  }: createGroupRoomArgs) {
    return this.prisma.room.create({
      data: {
        type: 'GROUP',
        name,
        avatarUrl,
        createdByUserId: userId,
        memberships: {
          createMany: {
            data: memberships.map((member) => ({ userId: member.id })),
            skipDuplicates: true,
          },
          create: { userId, role: 'OWNER' },
        },
      },
      include: {
        memberships: activeMembershipsInclude,
      },
    });
  }

  async findByIdUserRoom(userId: string, roomId: string) {
    return this.prisma.room.findFirst({
      where: {
        id: roomId,
        memberships: { some: { userId, leftAt: null } },
      },
      include: {
        memberships: activeMembershipsInclude,
      },
    });
  }

  async findAllUserRooms(userId: string, limit: number, offset: number) {
    return this.prisma.room.findMany({
      where: {
        memberships: { some: { userId, leftAt: null } },
      },
      include: {
        memberships: activeMembershipsInclude,
      },
      take: limit,
      skip: offset * limit,
    });
  }

  async updateGroupName(userId: string, roomId: string, name: string) {
    return this.prisma.room.update({
      where: {
        id: roomId,
        type: 'GROUP',
        memberships: { some: { userId } },
      },
      data: {
        name,
      },
      include: { memberships: activeMembershipsInclude },
    });
  }

  async updateGroupAvatar(
    userId: string,
    roomId: string,
    avatarUrl: string,
    avatarPublicId: string,
  ) {
    return this.prisma.room.update({
      where: {
        id: roomId,
        type: 'GROUP',
        memberships: { some: { userId } },
      },
      data: {
        avatarUrl,
        avatarPublicId,
      },
      include: {
        memberships: activeMembershipsInclude,
      },
    });
  }
}
