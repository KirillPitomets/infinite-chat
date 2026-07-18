import { Injectable } from '@nestjs/common';
import { type CreateLinkDto } from '@infinite-chat/shared';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
