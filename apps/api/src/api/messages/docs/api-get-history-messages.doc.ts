import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { MessageEntity } from '../entity';

export function ApiGetMessageHistory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get room message history',
      description:
        'Retrieves a paginated list of chat messages for a specific room. The user must be a member of the room.',
    }),
    ApiParam({
      name: 'roomId',
      type: String,
      description: 'Unique room identifier (uuid)',
      example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    }),
    ApiOkResponse({
      description: 'List of room messages successfully retrieved',
      type: MessageEntity,
      isArray: true,
    }),
    ApiUnauthorizedResponse({
      description: 'User is not authenticated (missing or invalid Clerk token)',
    }),
    ApiForbiddenResponse({
      description: 'Access denied (user is not a member of the room)',
    }),
    ApiNotFoundResponse({
      description: 'User profile with the specified Clerk ID was not found',
    }),
  );
}
