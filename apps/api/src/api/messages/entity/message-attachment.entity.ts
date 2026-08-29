import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MessageAttachment } from 'src/generated/prisma/client';
import { MessageAttachmentType } from 'src/generated/prisma/enums';

export class MessageAttachmentEntity implements MessageAttachment {
  @ApiProperty({
    description: 'Unique attachment identifier (uuid)',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id: string;

  @ApiProperty({
    description:
      'Storage key/filename in the cloud storage (e.g., Cloudinary/S3)',
    example: 'uploads/messages/att_12345.png',
  })
  key: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'document.pdf',
  })
  name: string;

  @ApiProperty({
    description: 'Direct public URL of the uploaded attachment',
    example: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1048576,
  })
  size: number;

  @ApiProperty({
    description: 'Type of attachment (e.g., IMAGE, FILE, AUDIO, VIDEO)',
    enum: MessageAttachmentType,
    example: MessageAttachmentType.IMAGE,
  })
  type: MessageAttachmentType;

  @ApiProperty({
    description: 'Timestamp when the attachment was created',
    example: '2026-03-30T12:00:00.000Z',
  })
  createdAt: Date;

  @Exclude()
  messageId: string;

  constructor(attachment: MessageAttachment) {
    Object.assign(this, attachment);
  }
}
