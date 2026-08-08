import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { MessageAttachmentType } from 'src/generated/prisma/client';
import { CreateMessageAttachmentDto } from './create-message-attachment.dto';

export class CreateMessageDto {
  @IsUUID('4')
  roomId: string;

  @IsOptional()
  @IsString()
  @Length(2, 160)
  text?: string;

  @IsOptional()
  @IsUUID('7') // model Message using 7 version of UUID
  replyToMessageId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMessageAttachmentDto)
  attachments: CreateMessageAttachmentDto[];
}
