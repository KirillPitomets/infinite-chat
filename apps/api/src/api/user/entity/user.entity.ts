import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/generated/prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    description: 'Unique identifier of the user (UUID)',
    example: '070145d6-2ba3-4588-b911-7e168e6d4880',
  })
  id: string;

  @Exclude()
  clerkId: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'john_dev',
  })
  username: string;

  @ApiProperty({
    description: 'Primary email address of the user',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'URL of the user profile avatar',
    example: 'https://img.clerk.com/xxx.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Timestamp when the user was last active',
    type: Date,
    example: '2026-07-29T10:00:00.000Z',
  })
  lastSeen: Date;

  @ApiProperty({
    description: 'Timestamp when the user account was created',
    type: Date,
    example: '2026-01-15T08:30:00.000Z',
  })
  createdAt: Date;

  constructor(user: UserEntity) {
    Object.assign(this, user);
  }
}
