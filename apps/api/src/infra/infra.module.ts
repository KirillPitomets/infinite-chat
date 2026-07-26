import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClerkModule } from './clerk/clerk.module';

@Module({
  imports: [PrismaModule, ClerkModule],
})
export class InfraModule {}
