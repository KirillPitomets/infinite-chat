import { User } from 'src/generated/prisma/client';

export class UserEntity implements User {
  id: string;
  clerkId: string;

  tag: string;
  email: string;
  name: string;
  imageUrl: string;

  createdAt: Date;
  lastSeen: Date;
}
