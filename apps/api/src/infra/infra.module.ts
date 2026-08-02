import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClerkModule } from './clerk/clerk.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, ClerkModule, CloudinaryModule],
})
export class InfraModule {}
