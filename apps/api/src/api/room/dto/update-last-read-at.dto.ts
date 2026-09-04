import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID, MaxDate } from 'class-validator';

export class UpdateRoomMemberLastReadAtDto {
  @ApiProperty({
    description:
      'Unique room identifier where the read status is updated (UUID v4)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID('4')
  roomId: string;
  @ApiProperty({
    description:
      'Timestamp up to which all messages in the room are marked as read',
    example: '2026-06-06T12:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  lastReadAt: Date;
}
