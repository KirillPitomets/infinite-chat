import { Test, TestingModule } from '@nestjs/testing';
import { PresenceGateway } from './presence.gateway';
import { PresenceService } from './presence.service';

describe('PresenceGateway', () => {
  let gateway: PresenceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresenceGateway, PresenceService],
    }).compile();

    gateway = module.get<PresenceGateway>(PresenceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
