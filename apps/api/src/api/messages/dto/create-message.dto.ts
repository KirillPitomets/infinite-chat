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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/*
undefined  = no field in dto = no change
null       = client made data is empty (remove text or replyMessage)
string     = change data from dto 
*/

export class CreateMessageDto {
  @ApiProperty({
    description: 'Unique room identifier where the message is sent (UUID v4)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  @IsUUID('4')
  roomId: string;

  @ApiPropertyOptional({
    description: 'Text content of the message (max 160 characters)',
    example: 'Hello, team!',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 160)
  text?: string | null;

  @ApiPropertyOptional({
    description: 'Identifier of the message being replied to (UUID v7)',
    example: '018f3b2c-8a1a-7b2c-8d3e-4f5a6b7c8d9e',
    format: 'uuid',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsUUID('7') // model Message using 7 version of UUID
  replyToMessageId?: string | null;

  @ApiPropertyOptional({
    description: 'List of attachments included in the message',
    type: [CreateMessageAttachmentDto],
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMessageAttachmentDto)
  attachments: CreateMessageAttachmentDto[] | null;
}
