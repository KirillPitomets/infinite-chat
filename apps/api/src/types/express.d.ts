import { JwtPayload } from '@clerk/types';

declare global {
  namespace Express {
    interface Request {
      auth: { payload: JwtPayload; clerkId: string };
    }
  }
}

export {};
