import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClerkModule } from './clerk/clerk.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';

@Module({
  imports: [PrismaModule, ClerkModule, CloudinaryModule, FirebaseAdminModule],
})
export class InfraModule {}
