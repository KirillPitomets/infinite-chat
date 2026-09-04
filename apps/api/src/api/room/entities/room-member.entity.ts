import { Exclude, Type } from 'class-transformer';
import { UserEntity } from 'src/api/user/entity';
import { RoomMemberRole, RoomMember } from 'src/generated/prisma/client';

import { ApiProperty } from '@nestjs/swagger';
import { RoomMemberGetPayload } from 'src/generated/prisma/models';

type RoomMemberWithUser = RoomMemberGetPayload<{ include: { user } }>;

export class RoomMemberEntity implements RoomMember {
  @ApiProperty({
    description: 'Unique identifier of the room membership (UUID)',
    example: 'b1f486a9-8f92-4c6e-93b1-2e64b8a2c3d4',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Date and time when the user last read messages in this room',
    type: Date,
    example: '2026-07-30T10:15:00.000Z',
  })
  lastReadAt: Date;

  @Exclude()
  leftAt: Date | null;

  @ApiProperty({
    description: 'Role of the member within the room',
    enum: RoomMemberRole,
    example: RoomMemberRole.MEMBER,
  })
  role: RoomMemberRole;

  @Exclude()
  roomId: string;

  @Exclude()
  userId: string;

  @ApiProperty({
    description: 'Detailed profile information of the member user',
    type: () => UserEntity,
  })
  @Type(() => UserEntity)
  user: UserEntity;

  constructor(roomMember: RoomMemberWithUser) {
    Object.assign(this, roomMember);
    this.user = new UserEntity(roomMember.user);
  }
}
