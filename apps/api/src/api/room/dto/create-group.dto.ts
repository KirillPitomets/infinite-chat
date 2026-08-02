import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsString,
  IsUUID,
  Length,
  Matches,
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
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  memberIds: string[];

  @ApiProperty({
    description: 'Name of the group chat',
    example: 'Project Team Chat',
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(/^[\p{L}\p{N}_ -]+$/u)
  @Length(2, 32)
  name: string;
}
