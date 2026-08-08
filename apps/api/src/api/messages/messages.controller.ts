import { Controller, Get } from '@nestjs/common';

@Controller('/message')
export class MessagesController {
  constructor() {}

  @Get()
  async echoHello() {
    return { echo: 'Messages controller' };
  }
}
