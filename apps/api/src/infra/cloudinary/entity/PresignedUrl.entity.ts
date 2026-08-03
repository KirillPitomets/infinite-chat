import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlEntity {
  @ApiProperty({
    description:
      'Cryptographic signature for authenticating the direct upload request',
    example: 'a1b2c3d4e5f67890123456789abcdef012345678',
  })
  signature: string;

  @ApiProperty({
    description: 'Timestamp when the signature was generated',
    example: '1718712345',
  })
  timestamp: string;

  @ApiProperty({
    description:
      'Target folder in cloud storage where the file will be uploaded',
    example: 'groups/{roomId}/avatar',
  })
  folder: string;

  @ApiProperty({
    description: 'Generated public identifier (name) for the uploaded file',
    example: 'room_a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11_1718712345',
  })
  publicId: string;

  @ApiProperty({
    description: 'Cloudinary API key associated with the account',
    example: '123456789012345',
  })
  apiKey: string;

  @ApiProperty({
    description: 'Cloud storage cloud name',
    example: 'my-cloud-name',
  })
  cloudName: string;

  constructor(entity: PresignedUrlEntity) {
    Object.assign(this, entity);
  }
}
