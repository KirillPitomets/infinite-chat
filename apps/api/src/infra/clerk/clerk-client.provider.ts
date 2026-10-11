import { createClerkClient } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';

export const CLERK_CLIENT = 'ClerkClient';

export const ClerkClientProvider = {
  provide: CLERK_CLIENT,
  useFactory: (configService: ConfigService) => {
    return createClerkClient({
      publishableKey: configService.getOrThrow<string>('CLERK_PUBLISHABLE_KEY'),
      secretKey: configService.getOrThrow<string>('CLERK_SECRET_KEY'),
    });
  },
  inject: [ConfigService],
};
