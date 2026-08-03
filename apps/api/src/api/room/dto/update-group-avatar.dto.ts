import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UpdateGroupAvatarDto {
  @ApiProperty({
    description: 'URL of the group chat avatar',
    example: 'https://example.com/images/group.jpg',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Id of the group chat avatar',
    example: 'groups/{roomId}/avatar',
  })
  @IsString()
  publicId: string;
}
