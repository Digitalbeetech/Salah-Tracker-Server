import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalahTrackerService } from './salah-tracker.service';
import { SalahTrackerController } from './salah-tracker.controller';
import { SalahRecord, SalahRecordSchema } from './schemas/salah-tracker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalahRecord.name, schema: SalahRecordSchema },
    ]),
  ],
  controllers: [SalahTrackerController],
  providers: [SalahTrackerService],
})
export class SalahTrackerModule {}
