import { User } from 'src/generated/prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: string;
  @Exclude()
  clerkId: string;

  firstName: string;
  lastName: string;

  username: string;
  email: string;

  imageUrl: string;
  lastSeen: Date;

  createdAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
