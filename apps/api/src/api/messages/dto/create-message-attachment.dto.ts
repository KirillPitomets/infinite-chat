import { IsString, IsEnum, IsInt, IsUrl } from 'class-validator';
import { MessageAttachmentType } from 'src/generated/prisma/enums';

export class CreateMessageAttachmentDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsEnum(MessageAttachmentType)
  type: MessageAttachmentType;

  @IsInt()
  size: number;

  @IsUrl()
  url: string;
}
