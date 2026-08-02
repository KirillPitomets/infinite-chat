import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CLOUDINARY_PROVIDER = 'CloudinaryClient';

export const CloudinaryProvider = {
  provide: CLOUDINARY_PROVIDER,
  useFactory: (configService: ConfigService) => {
    return v2.config({
      api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
