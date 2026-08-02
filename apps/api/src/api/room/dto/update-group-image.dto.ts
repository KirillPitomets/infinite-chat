import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UpdateGroupImageDto {
  @ApiProperty({
    description: 'URL of the group chat avatar',
    example: 'https://example.com/images/group.jpg',
  })
  @IsUrl()
  avatarUrl: string;

  @ApiProperty({
    description: 'Id of the group chat avatar',
    example: 'groups/{roomId}/avatar',
  })
  @IsString()
  avatarPublicId: string;
}
