import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteMessageDto {
  @ApiProperty({
    description: 'Unique room identifier (UUID v4)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  @IsUUID('4')
  roomId: string;

  @ApiProperty({
    description: 'Unique message identifier to delete (UUID v7)',
    example: '018f3b2c-8a1a-7b2c-8d3e-4f5a6b7c8d9e',
    format: 'uuid',
  })
  @IsUUID('7')
  messageId: string;
}
