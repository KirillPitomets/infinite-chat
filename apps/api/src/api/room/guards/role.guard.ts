import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoomMemberRole } from 'src/generated/prisma/enums';
import { ROLE_KEY } from '../decorators/role.decorator';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { type Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresRole = this.reflector.getAllAndOverride<RoomMemberRole>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiresRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;
    const auth = request.auth;
    const roomId = request.params.roomId as string;

    if (!auth.clerkId) {
      throw new UnauthorizedException('User not authorized');
    }

    if (!roomId) {
      throw new BadRequestException('roomId param is missing');
    }

    const membership = await this.prisma.roomMember.findFirst({
      where: {
        roomId,
        user: { clerkId: auth.clerkId },
      },
      include: { room: true, user: true },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member in this room');
    }

    if (membership.room.type === 'DIRECT') return true;

    if (!this.hasRequiredRole(membership.role, requiresRole)) {
      throw new ForbiddenException(`Requires role ${requiresRole} or higher`);
    }

    return true;
  }

  hasRequiredRole(actual: RoomMemberRole, required: RoomMemberRole): boolean {
    const hierarchy: RoomMemberRole[] = ['MEMBER', 'ADMIN', 'OWNER'];
    return hierarchy.indexOf(actual) >= hierarchy.indexOf(required);
  }
}
