import { Test, TestingModule } from '@nestjs/testing';
import { SalahTrackerController } from './salah-tracker.controller';
import { SalahTrackerService } from './salah-tracker.service';

describe('SalahTrackerController', () => {
  let controller: SalahTrackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalahTrackerController],
      providers: [SalahTrackerService],
    }).compile();

    controller = module.get<SalahTrackerController>(SalahTrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
