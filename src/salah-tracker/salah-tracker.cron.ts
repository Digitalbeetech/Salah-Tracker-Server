import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalahRecord } from './schemas/salah-tracker.schema'; // adjust path if needed

@Injectable()
export class SalahTrackerCron {
  private readonly logger = new Logger(SalahTrackerCron.name);

  constructor(
    @InjectModel(SalahRecord.name)
    private readonly salahRecordModel: Model<SalahRecord>,
  ) {}

  // Run every day at 00:00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markUnmarkedAsMissed() {
    this.logger.log('Running daily Salah missed update job...');

    const today = new Date().toISOString().split('T')[0]; // e.g., '2025-11-05'

    // Find all records where date < today
    const records = await this.salahRecordModel.find({
      date: { $lt: today },
    });

    for (const record of records) {
      let updated = false;

      for (const prayer of record.prayers) {
        for (const rakat of prayer.rakats) {
          if (!rakat.markAsOffered) {
            rakat.markAsOffered = 'Missed';
            updated = true;
          }
        }
      }

      if (updated) {
        await record.save();
        this.logger.log(`Updated missed Salahs for record on ${record.date}`);
      }
    }

    this.logger.log('Daily Salah missed update job completed.');
  }
}
