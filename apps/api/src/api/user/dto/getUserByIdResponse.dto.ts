import { createZodDto } from 'nestjs-zod';
import { UserSchema } from '@infinite-chat/shared';

export class GetUserByIdResponse extends createZodDto(UserSchema) {}
