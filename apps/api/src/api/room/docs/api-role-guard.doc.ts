import { applyDecorators } from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ErrResponse } from 'src/common/dto/error-response.dto';
import { RoomMemberRole } from 'src/generated/prisma/enums';

export function ApiRoleGuardResponse(requiredRole: RoomMemberRole) {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'User is not authenticated (missing Clerk ID)',
      type: ErrResponse,
    }),
    ApiBadRequestResponse({
      description: 'roomId param is missing from the request',
      type: ErrResponse,
    }),
    ApiForbiddenResponse({
      description: `User is not a member of this room, or lacks the required role (${requiredRole} or higher). Not enforced for DIRECT rooms.`,
      type: ErrResponse,
    }),
  );
}
