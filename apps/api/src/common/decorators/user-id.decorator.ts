import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';

export const ClerkUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req.auth.clerkId;
  },
);
