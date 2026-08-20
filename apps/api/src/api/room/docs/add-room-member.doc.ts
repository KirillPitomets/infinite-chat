import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RoomEntity } from '../entities';

export function ApiAddMember() {
  return applyDecorators(
    ApiOperation({
      summary: 'Add member to group room',
      description:
        'Adds a new member to a GROUP room. Requires ADMIN role in the room. If the user previously left the group, their membership is restored instead of creating a duplicate.',
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiParam({
      name: 'memberId',
      description: 'ID of the user to add to the group',
      example: '018f4c2e-7b3a-7c3e-8b3a-7c3e8b3a7c3e',
    }),
    ApiOkResponse({
      description: 'Member successfully added (or restored) to the group',
      type: RoomEntity,
    }),
    ApiBadRequestResponse({
      description:
        'The room is a DIRECT chat (adding members is not supported), or the user is already an active member of this group',
    }),
    ApiNotFoundResponse({
      description: 'Room not found, or the specified member ID does not exist',
    }),
    ApiForbiddenResponse({
      description: 'Current user does not have ADMIN role in this room',
    }),
  );
}
