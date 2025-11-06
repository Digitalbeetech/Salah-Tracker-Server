import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalahTrackerService } from './salah-tracker.service';
import { SalahTrackerController } from './salah-tracker.controller';
import { SalahTrackerCron } from './salah-tracker.cron';
import { SalahRecord, SalahRecordSchema } from './schemas/salah-tracker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalahRecord.name, schema: SalahRecordSchema },
    ]),
  ],
  controllers: [SalahTrackerController],
  providers: [SalahTrackerService, SalahTrackerCron],
})
export class SalahTrackerModule {}
