import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { UserEntity } from '../entity';
import { ErrResponse } from 'src/common/dto/error-response.dto';

export function ApiGetCurrentUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get current user profile',
      description:
        'Retrieves the profile of the currently authenticated user based on the Clerk authentication token.',
    }),
    ApiOkResponse({
      description: 'Current user profile successfully retrieved',
      type: UserEntity,
    }),
    ApiUnauthorizedResponse({
      description: 'User is not authenticated (missing or invalid Clerk token)',
      type: ErrResponse,
    }),
    ApiNotFoundResponse({
      description:
        'User profile with the specified Clerk ID was not found in the database',
      type: ErrResponse,
    }),
  );
}
