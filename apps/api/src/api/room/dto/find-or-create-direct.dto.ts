import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class FindOrCreateDirectRoomDto {
  @ApiProperty({
    description: 'ID of the target user to start a direct chat with (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  memberId: string;
}
