import { IsEnum, IsInt, IsString, IsUrl, Max } from 'class-validator';
import { MessageAttachmentType } from 'src/generated/prisma/enums';

export class CreateMessageAttachmentDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsEnum(MessageAttachmentType)
  type: MessageAttachmentType;

  @IsInt()
  @Max(20 * 1024 * 1024) // 20mb
  size: number;

  @IsUrl()
  url: string;
}
