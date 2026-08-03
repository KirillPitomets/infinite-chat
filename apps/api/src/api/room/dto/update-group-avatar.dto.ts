import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Matches } from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

const cloudName = process.env['CLOUDINARY_KEY_NAME'];

export class UpdateGroupAvatarDto {
  @ApiProperty({
    description: 'URL of the group chat avatar',
    example: 'https://example.com/images/group.jpg',
  })
  @IsUrl()
  @Matches(new RegExp(`^https:\\/\\/res\\.cloudinary\\.com\\/${cloudName}\\/`))
  url: string;

  @ApiProperty({
    description: 'Id of the group chat avatar',
    example: 'groups/{roomId}/avatar',
  })
  @IsString()
  publicId: string;
}
