import { SetMetadata } from '@nestjs/common';
import { RoomMemberRole } from 'src/generated/prisma/enums';

export const ROLE_KEY = 'room_member_role';
export const Role = (role: RoomMemberRole) => SetMetadata(ROLE_KEY, role);
