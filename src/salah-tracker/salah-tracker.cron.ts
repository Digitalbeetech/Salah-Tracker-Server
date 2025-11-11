import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { SalahRecord } from './schemas/salah-tracker.schema';

@Injectable()
export class SalahTrackerCron {
  private readonly logger = new Logger(SalahTrackerCron.name);

  constructor(
    @InjectModel(SalahRecord.name)
    private readonly salahRecordModel: Model<SalahRecord>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  // Run every day at midnight (set to 5min for testing)
  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailySalahTracking() {
    const start = Date.now();
    this.logger.log('🚀 Starting Salah Tracker Cron Job...');

    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);

    // Default Salah structure
    const defaultPrayers = this.getDefaultPrayers();

    // 🔹 Fetch users from DB
    const users = await this.connection
      .collection('users')
      .find({}, { projection: { _id: 1 } })
      .toArray();

    const totalUsers = users.length;
    if (totalUsers === 0) {
      this.logger.warn('⚠️ No users found. Skipping cron job.');
      return;
    }

    this.logger.log(
      `👥 Found ${totalUsers} users. Processing Salah records...`,
    );

    // Progress tracking
    let processed = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    const batchSize = 20; // adjust based on server capacity

    for (let i = 0; i < totalUsers; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      // Process users in parallel (within batch)
      await Promise.allSettled(
        batch.map(async (user) => {
          const result = await this.processUser(
            user._id,
            today,
            todayDate,
            defaultPrayers,
          );
          if (result === 'updated') updated++;
          else if (result === 'skipped') skipped++;
        }),
      ).then((results) => {
        failed += results.filter((r) => r.status === 'rejected').length;
      });

      processed += batch.length;
      this.renderProgress(processed, totalUsers);
    }

    process.stdout.write('\n'); // move cursor to new line

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    this.logger.log('🏁 Salah Tracker Cron Completed.');
    this.logger.log(
      `📊 Summary:
      ✅ Processed Users: ${processed}
      ⏭️ Skipped (no Salah data): ${skipped}
      🟠 Updated Salahs: ${updated}
      ❌ Failed: ${failed}
      ⏱️ Duration: ${duration}s`,
    );
  }

  /**
   * Process Salah Records for a Single User
   */
  private async processUser(
    userId: any,
    today: string,
    todayDate: Date,
    defaultPrayers: any[],
  ): Promise<'updated' | 'skipped' | void> {
    try {
      const hasRecords = await this.salahRecordModel.exists({ userId });
      if (!hasRecords) return 'skipped';

      // ✅ Ensure today's record exists
      const todayExists = await this.salahRecordModel.exists({
        userId,
        date: today,
      });
      if (!todayExists) {
        await this.salahRecordModel.create({
          userId,
          date: today,
          prayers: defaultPrayers,
        });
      }

      // ✅ Fill missing date gaps efficiently
      const firstRecord = await this.salahRecordModel
        .findOne({ userId })
        .sort({ date: 1 })
        .lean();

      if (firstRecord) {
        const firstDate = new Date(firstRecord.date);
        const missingDates: string[] = [];

        for (
          let d = new Date(firstDate);
          d < todayDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dateStr = d.toISOString().split('T')[0];
          const exists = await this.salahRecordModel.exists({
            userId,
            date: dateStr,
          });
          if (!exists) missingDates.push(dateStr);
        }

        if (missingDates.length > 0) {
          const newRecords = missingDates.map((date) => ({
            userId,
            date,
            prayers: defaultPrayers,
          }));
          await this.salahRecordModel.insertMany(newRecords, {
            ordered: false,
          });
        }
      }

      // ✅ Mark missed Salahs for past records
      const pastRecords = await this.salahRecordModel.find({
        userId,
        date: { $lt: today },
      });

      let modifiedCount = 0;
      for (const record of pastRecords) {
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
          modifiedCount++;
        }
      }

      if (modifiedCount > 0) return 'updated';
    } catch (error) {
      this.logger.error(`❌ Error processing user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Dynamic Colored Progress Bar
   */
  private renderProgress(current: number, total: number) {
    const percent = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((percent / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength);

    // 🎨 Dynamic color coding
    let colorStart = '\x1b[31m'; // red
    if (percent >= 50) colorStart = '\x1b[33m'; // yellow
    if (percent >= 90) colorStart = '\x1b[32m'; // green
    const colorEnd = '\x1b[0m';

    process.stdout.write(
      `\r${colorStart}[${bar}] ${percent}% (${current}/${total})${colorEnd}`,
    );
  }

  /**
   * Default Prayer Template
   */
  private getDefaultPrayers() {
    return [
      {
        name: 'Fajr',
        key: 'Fajr',
        subtext: 'Sunrise at 06:40',
        time: '',
        rakats: [
          { farz: false, number: 2, markAsOffered: null, time: '' },
          { farz: true, number: 2, markAsOffered: null, time: '' },
        ],
      },
      {
        name: 'Zuhr',
        key: 'Dhuhr',
        subtext: 'Pray Now',
        time: '',
        rakats: [
          { farz: false, number: 4, markAsOffered: null, time: '' },
          { farz: true, number: 4, markAsOffered: null, time: '' },
          { farz: false, number: 2, markAsOffered: null, time: '' },
        ],
      },
      {
        name: 'Asr',
        key: 'Asr',
        subtext: 'Before Sunset',
        time: '',
        rakats: [
          { farz: false, number: 4, markAsOffered: null, time: '' },
          { farz: true, number: 4, markAsOffered: null, time: '' },
        ],
      },
      {
        name: 'Maghrib',
        key: 'Maghrib',
        subtext: 'After Sunset',
        time: '',
        rakats: [
          { farz: true, number: 3, markAsOffered: null, time: '' },
          { farz: false, number: 2, markAsOffered: null, time: '' },
        ],
      },
      {
        name: 'Isha',
        key: 'Isha',
        subtext: 'Before Midnight',
        time: '',
        rakats: [
          { farz: false, number: 4, markAsOffered: null, time: '' },
          { farz: true, number: 4, markAsOffered: null, time: '' },
          { farz: false, number: 3, markAsOffered: null, time: '' },
          { farz: false, number: 2, markAsOffered: null, time: '' },
        ],
      },
    ];
  }
}
