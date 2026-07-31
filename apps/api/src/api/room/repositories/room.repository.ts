import { Injectable } from '@nestjs/common';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { createGroupRoomArgs } from './types/room.repository.types';

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDirectRoom(userId: string, memberId: string) {
    return this.prisma.room.findFirst({
      where: {
        type: 'DIRECT',
        memberships: { some: { userId: userId } },
        AND: { memberships: { some: { userId: memberId } } },
      },
      include: { memberships: { include: { user: true } } },
    });
  }

  async createDirectRoom(userId: string, memberId: string) {
    return this.prisma.room.create({
      data: {
        type: 'DIRECT',
        createdByUserId: userId,
        memberships: { create: [{ userId: memberId }, { userId: userId }] },
      },
      include: { memberships: { include: { user: true } } },
    });
  }

  async createGroupRoom({
    userId,
    name,
    memberships,
    imageUrl,
  }: createGroupRoomArgs) {
    return this.prisma.room.create({
      data: {
        type: 'GROUP',
        name,
        imageUrl,
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
        memberships: {
          include: { user: true },
        },
      },
    });
  }

  async findByIdForUser(userId: string, roomId: string) {
    return this.prisma.room.findUnique({
      where: { id: roomId, memberships: { some: { userId } } },
      include: {
        memberships: {
          include: { user: true },
        },
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.room.findMany({
      where: {
        memberships: { some: { userId } },
      },
      include: {
        memberships: {
          include: { user: true },
        },
      },
    });
  }
}
