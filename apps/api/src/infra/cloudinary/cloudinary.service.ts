import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PresignedUrlEntity } from './entity/PresignedUrl.entity';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  getGroupRoomAvatarSignature(groupId: string): PresignedUrlEntity {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `groups/${groupId}`;
    const publicId = 'avatar';

    const paramsToSign = {
      timestamp,
      folder,
      public_id: publicId,
      overwrite: true,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    );

    return new PresignedUrlEntity({
      signature,
      timestamp: timestamp.toString(),
      folder,
      publicId,
      apiKey: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      cloudName: this.configService.getOrThrow('CLOUDINARY_KEY_NAME'),
    });
  }
}
