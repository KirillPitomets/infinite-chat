import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class TypingDto {
  @ApiProperty({
    description: 'Unique room identifier where the user is typing (UUID v4)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  @IsUUID('4')
  roomId: string;
}
