import { Controller, Get } from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@UserId() userId: string) {
    console.log(userId);
    return 'Hello';
  }
}
