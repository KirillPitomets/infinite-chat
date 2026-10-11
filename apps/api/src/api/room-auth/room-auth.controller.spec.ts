import { Test, TestingModule } from '@nestjs/testing';
import { RoomAuthController } from './room-auth.controller';
import { RoomAuthService } from './room-auth.service';

describe('RoomAuthController', () => {
  let controller: RoomAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomAuthController],
      providers: [RoomAuthService],
    }).compile();

    controller = module.get<RoomAuthController>(RoomAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
