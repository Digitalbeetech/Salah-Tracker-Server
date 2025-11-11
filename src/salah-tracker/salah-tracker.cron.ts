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

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleDailySalahTracking() {
    this.logger.log('🚀 Starting userwise Salah tracker cron...');

    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);

    const defaultPrayers = [
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

    // 🧍‍♂️ Fetch all users
    const users = await this.connection
      .collection('users')
      .find({}, { projection: { _id: 1 } })
      .toArray();

    this.logger.log(`Found ${users.length} total users.`);

    const batchSize = 20;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      const batchPromises = batch.map((user) =>
        this.processUserSalahRecords(
          user._id,
          today,
          todayDate,
          defaultPrayers,
        ),
      );

      const results = await Promise.allSettled(batchPromises);

      const successCount = results.filter(
        (r) => r.status === 'fulfilled',
      ).length;
      const failedCount = results.filter((r) => r.status === 'rejected').length;

      this.logger.log(
        `✅ Batch ${i / batchSize + 1}: Processed ${successCount} users successfully, ${failedCount} failed.`,
      );
    }

    this.logger.log('🏁 Salah tracker cron completed.');
  }

  private async processUserSalahRecords(
    userId: any,
    today: string,
    todayDate: Date,
    defaultPrayers: any[],
  ) {
    try {
      // ✅ Skip users who have no Salah records at all
      const hasRecords = await this.salahRecordModel.exists({ userId });
      if (!hasRecords) {
        this.logger.log(`⏭️ Skipping user ${userId} (no Salah records found).`);
        return;
      }

      // ✅ Create today's record if missing
      const existingToday = await this.salahRecordModel.findOne({
        userId,
        date: today,
      });
      if (!existingToday) {
        await this.salahRecordModel.create({
          userId,
          date: today,
          prayers: defaultPrayers,
        });
        this.logger.log(`🆕 Created Salah record for ${userId} (${today}).`);
      }

      // ✅ Fill any missing records
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
          await this.salahRecordModel.insertMany(newRecords);
          this.logger.log(
            `🆕 User ${userId}: Created ${newRecords.length} missing record(s).`,
          );
        }
      }

      // ✅ Only mutate existing user's Salah records
      const pastRecords = await this.salahRecordModel.find({
        userId,
        date: { $lt: today },
      });

      let modifiedCount = 0;

      for (const record of pastRecords) {
        let updated = false;
        for (const prayer of record.prayers) {
          for (const rakat of prayer.rakats) {
            if (
              !rakat.markAsOffered ||
              rakat.markAsOffered === '' ||
              rakat.markAsOffered === null
            ) {
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

      if (modifiedCount > 0)
        this.logger.log(
          `🟠 User ${userId}: Marked missed Salahs in ${modifiedCount} record(s).`,
        );
      else this.logger.log(`✅ User ${userId}: No missed Salahs to update.`);

      return `Processed user ${userId}`;
    } catch (err) {
      this.logger.error(`❌ Error processing user ${userId}: ${err.message}`);
      throw err;
    }
  }
}
