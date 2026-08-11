import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateMessageAttachmentDto } from '../../attachments/dto/create-message-attachment.dto';

/*
undefined  = no field in dto = no change
null       = client made data is empty (remove text or replyMessage)
string     = change data from dto 
*/

export class CreateMessageDto {
  @IsUUID('4')
  roomId: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  text?: string | null;

  @IsOptional()
  @IsUUID('7') // model Message using 7 version of UUID
  replyToMessageId?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMessageAttachmentDto)
  attachments: CreateMessageAttachmentDto[] | null;
}
