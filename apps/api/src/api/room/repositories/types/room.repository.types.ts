import { User } from 'src/generated/prisma/client';

export type createGroupRoomArgs = {
  userId: string;
  name: string;
  imageUrl?: string;
  memberships: User[];
};
