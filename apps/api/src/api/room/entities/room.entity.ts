import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Room, RoomType } from 'src/generated/prisma/client';
import { RoomGetPayload } from 'src/generated/prisma/models';
import { RoomMemberEntity } from './room-member.entity';

type RoomWithMemberships = RoomGetPayload<{ include: { memberships } }>;

export class RoomEntity implements Room {
  @ApiProperty({
    description: 'Unique identifier of the room (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the room',
    example: 'Cozy Living Room',
  })
  name: string;

  @ApiProperty({
    description: 'Type of the room',
    enum: RoomType,
    example: RoomType.DIRECT,
  })
  type: RoomType;

  @ApiProperty({
    description: 'URL of the room image',
    example: 'https://example.com/images/room1.jpg',
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'Id of the room image',
  })
  avatarPublicId: string;

  @Type(() => RoomMemberEntity)
  memberships: RoomMemberEntity[];

  @ApiProperty({
    description: 'ID of the user who created the room',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdByUserId: string;

  @ApiProperty({
    description: 'Date and time when the room was created',
    type: Date,
    example: '2026-07-30T07:04:18.000Z',
  })
  createdAt: Date;

  constructor(room: RoomWithMemberships) {
    Object.assign(this, room);

    this.memberships = room.memberships.map(
      (member) => new RoomMemberEntity(member),
    );
  }
}
