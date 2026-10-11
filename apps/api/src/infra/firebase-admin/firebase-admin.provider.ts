import { ConfigService } from '@nestjs/config';
import { initializeApp, cert } from 'firebase-admin';
export const FIREBASE_ADMIN = 'firebaseAdmin';

export const FirebaseAdminProvider = {
  provide: FIREBASE_ADMIN,
  useFactory: (configService: ConfigService) => {
    const privateKey = Buffer.from(
      configService.getOrThrow<string>('FIREBASE_PRIVATE_KEY'),
      'base64',
    ).toString('utf-8');

    return initializeApp({
      credential: cert({
        clientEmail: configService.getOrThrow<string>('FIREBASE_CLIENT_EMAIL'),
        projectId: configService.getOrThrow<string>('FIREBASE_PROJECT_ID'),
        privateKey: privateKey,
      }),
    });
  },
  inject: [ConfigService],
};
