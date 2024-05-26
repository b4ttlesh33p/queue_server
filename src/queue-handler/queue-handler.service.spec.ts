import { Test, TestingModule } from '@nestjs/testing';
import { QueueHandlerService } from './queue-handler.service';

describe('QueueHandlerService', () => {
  let service: QueueHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueHandlerService],
    }).compile();

    service = module.get<QueueHandlerService>(QueueHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
