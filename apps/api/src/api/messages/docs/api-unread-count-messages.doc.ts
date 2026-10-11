import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UnreadCountResponseDto } from '../dto/unread-count-response.dto';

export function ApiGetUnreadCount() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get unread message count',
      description:
        'Returns the number of unread messages in a specific room for the current user.',
    }),
    ApiParam({
      name: 'roomId',
      type: String,
      description: 'Unique room identifier (uuid)',
      example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    }),
    ApiOkResponse({
      description: 'Successfully retrieved unread message count',
      type: UnreadCountResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'User is not authenticated (missing or invalid Clerk token)',
    }),
    ApiForbiddenResponse({
      description: 'User is not a member of the specified room',
    }),
    ApiNotFoundResponse({
      description: 'Room or user profile was not found',
    }),
  );
}
