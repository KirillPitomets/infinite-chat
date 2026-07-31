import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateGroupRoomDto {
  @ApiProperty({
    description: 'Array of user IDs to include in the group (UUIDs)',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '987e6543-e21b-12d3-a456-426614174999',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  memberIds: string[];

  @ApiProperty({
    description: 'Name of the group chat',
    example: 'Project Team Chat',
  })
  @IsString()
  @Length(2, 16)
  name: string;

  @ApiPropertyOptional({
    description: 'URL of the group chat avatar',
    example: 'https://example.com/images/group.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
