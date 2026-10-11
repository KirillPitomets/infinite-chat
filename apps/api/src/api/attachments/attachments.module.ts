import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
