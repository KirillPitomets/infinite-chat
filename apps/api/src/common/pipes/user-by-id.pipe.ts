import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(clerkUserId: string): Promise<User> {
    const user = await this.userService.findByClerkId(clerkUserId);

    if (!user) {
      throw new NotFoundException(`User with ID: ${clerkUserId} not found`);
    }

    return user;
  }
}
