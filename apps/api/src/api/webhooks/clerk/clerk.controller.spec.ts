import { Test, TestingModule } from '@nestjs/testing';
import { ClerkController } from './clerkWebhook.controller';
import { ClerkService } from './clerk.service';

describe('ClerkController', () => {
  let controller: ClerkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkController],
      providers: [ClerkService],
    }).compile();

    controller = module.get<ClerkController>(ClerkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
