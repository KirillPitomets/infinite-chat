import { verifyToken } from '@clerk/backend';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type Request } from 'express';
import { Strategy } from 'passport-custom';

export const CLERK_STRATEGY_NAME = 'clerk';

@Injectable()
export class ClerkStrategy extends PassportStrategy(
  Strategy,
  CLERK_STRATEGY_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async validate(req: Request): Promise<{ sub: string }> {
    const token = req.headers.authorization?.split(' ').pop();

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.getOrThrow<string>('CLERK_SECRET_KEY'),
      });
      return (req.auth = tokenPayload);
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
