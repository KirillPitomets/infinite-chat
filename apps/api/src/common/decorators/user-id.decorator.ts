import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req.auth.sub;
  },
);
