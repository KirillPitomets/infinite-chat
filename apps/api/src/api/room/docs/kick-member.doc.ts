import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ErrResponse } from 'src/common/dto/error-response.dto';

export function ApiKickMember() {
  return applyDecorators(
    ApiOperation({
      summary: 'Kick a member from the group room',
      description:
        'Removes a specific user from the room membership list. Requires ADMIN or higher role. Cannot kick yourself or the room owner.',
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiParam({
      name: 'memberId',
      description: 'Unique user identifier of the member to kick (UUID)',
      example: 'b1ffdc88-8b0a-3de7-aa5c-5aa8ac279f00',
      format: 'uuid',
    }),
    ApiNoContentResponse({
      description: 'Member successfully removed from the room',
      type: ErrResponse,
    }),
    ApiNotFoundResponse({
      description:
        'Group room was not found, or the specified member is not in the room',
      type: ErrResponse,
    }),
    ApiBadRequestResponse({
      description:
        'roomId/memberId param is missing, attempted to kick yourself, or attempted to kick the room owner',
      type: ErrResponse,
    }),
  );
}
