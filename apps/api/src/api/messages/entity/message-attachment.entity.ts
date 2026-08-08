import { Exclude } from 'class-transformer';
import { MessageAttachment } from 'src/generated/prisma/client';
import { MessageAttachmentType } from 'src/generated/prisma/enums';

export class MessageAttachmentEntity implements MessageAttachment {
  id: string;
  key: string;
  name: string;
  url: string;
  size: number;
  type: MessageAttachmentType;

  createdAt: Date;

  @Exclude()
  messageId: string;

  constructor(attachment: MessageAttachment) {
    Object.assign(this, attachment);
  }
}
