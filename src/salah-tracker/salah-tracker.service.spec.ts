import { Test, TestingModule } from '@nestjs/testing';
import { SalahTrackerService } from './salah-tracker.service';

describe('SalahTrackerService', () => {
  let service: SalahTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalahTrackerService],
    }).compile();

    service = module.get<SalahTrackerService>(SalahTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
