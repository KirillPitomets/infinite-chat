import { Module } from '@nestjs/common';
import { FirebaseAdminProvider } from './firebase-admin.provider';

@Module({
  providers: [FirebaseAdminProvider],
})
export class FirebaseAdminModule {}
