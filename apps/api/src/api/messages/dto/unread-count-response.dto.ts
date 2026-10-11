import { ApiProperty } from '@nestjs/swagger';

export class UnreadCountResponseDto {
  @ApiProperty({
    example: 12,
    description: 'Number of unread messages in the specified room',
  })
  unreadCount: number;
}
