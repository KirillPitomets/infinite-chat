import { Test, TestingModule } from '@nestjs/testing';
import { RoomAuthService } from './room-auth.service';

describe('RoomAuthService', () => {
  let service: RoomAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomAuthService],
    }).compile();

    service = module.get<RoomAuthService>(RoomAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
