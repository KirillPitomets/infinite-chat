import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/generated/prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: string;
  @Exclude()
  clerkId: string;

  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  lastSeen: Date;
}
