import { ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UpdateMessageAttachmentDto } from './dto/update-message-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async ensureAttachmentKeysAreUnique(keys: string[]) {
    console.log(keys);
    const existAttachments =
      await this.prismaService.messageAttachment.findMany({
        where: {
          key: { in: keys },
        },
      });

    if (existAttachments.length) {
      throw new ConflictException('Attachment key must be unique');
    }
  }

  async removeMessageAttachments(messageId: string) {
    const oldAttachments = await this.prismaService.messageAttachment.findMany({
      where: { messageId },
    });

    await this.prismaService.messageAttachment.deleteMany({
      where: { messageId },
    });

    await this.deleteFiles(oldAttachments.map((oldAtt) => oldAtt.key));
  }

  async replaceMessageAttachments(
    messageId: string,
    attachments: UpdateMessageAttachmentDto[],
  ) {
    const oldAttachments = await this.prismaService.messageAttachment.findMany({
      where: { messageId },
    });

    await this.prismaService.$transaction(async (tx) => {
      // Delete
      await tx.messageAttachment.deleteMany({
        where: { messageId },
      });
      // Create new
      await tx.messageAttachment.createMany({
        data: attachments.map((att) => ({
          messageId,
          key: att.key,
          name: att.name,
          size: att.size,
          type: att.type,
          url: att.url,
        })),
      });
    });

    await this.deleteFiles(oldAttachments.map((oldAtt) => oldAtt.key));
  }

  async deleteFiles(keys: string[]) {
    await Promise.all(
      keys.map(async (key) => await this.cloudinaryService.removeFile(key)),
    );
  }
}
