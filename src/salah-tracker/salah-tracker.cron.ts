import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalahRecord } from './schemas/salah-tracker.schema';

@Injectable()
export class SalahTrackerCron {
  private readonly logger = new Logger(SalahTrackerCron.name);

  constructor(
    @InjectModel(SalahRecord.name)
    private readonly salahRecordModel: Model<SalahRecord>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailySalahTracking() {
    this.logger.log('Running daily Salah tracker job...');

    const today = new Date().toISOString().split('T')[0]; // e.g., '2025-11-05'
    const todayDate = new Date(today);
    this.logger.log(`Today's date: ${today}`);

    const defaultPrayers = [
      {
        name: 'Fajr',
        key: 'Fajr',
        subtext: 'Sunrise at 06:40',
        rakats: [
          { farz: false, number: 2, markAsOffered: null, time: '' },
          { farz: true, number: 2, markAsOffered: null, time: '' },
        ],
      },
      {
        name: 'Zuhr',
        key: 'Dhuhr',
        subtext: 'Pray Now',
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
        rakats: [
          { farz: false, number: 4, markAsOffered: null, time: '' },
          { farz: true, number: 4, markAsOffered: null, time: '' },
        ],
      },
      {
        name: 'Maghrib',
        key: 'Maghrib',
        subtext: 'After Sunset',
        rakats: [
          { farz: true, number: 3, markAsOffered: null, time: '' },
          { farz: false, number: 2, markAsOffered: null, time: '' },
        ],
      },
      {
        name: 'Isha',
        key: 'Isha',
        subtext: 'Before Midnight',
        rakats: [
          { farz: false, number: 4, markAsOffered: null, time: '' },
          { farz: true, number: 4, markAsOffered: null, time: '' },
          { farz: false, number: 3, markAsOffered: null, time: '' },
          { farz: false, number: 2, markAsOffered: null, time: '' },
        ],
      },
    ];

    // ✅ 1. If no records exist at all, create yesterday and today
    const totalRecords = await this.salahRecordModel.countDocuments();
    if (totalRecords === 0) {
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      await this.salahRecordModel.insertMany([
        { date: yesterdayStr, prayers: defaultPrayers },
        { date: today, prayers: defaultPrayers },
      ]);

      this.logger.log(
        `🆕 Created first two records: ${yesterdayStr}, ${today}`,
      );
    } else {
      // ✅ 2. Create today's record if missing
      const existingToday = await this.salahRecordModel.findOne({
        date: today,
      });
      if (!existingToday) {
        await this.salahRecordModel.create({
          date: today,
          prayers: defaultPrayers,
        });
        this.logger.log(`✅ Created new Salah record for ${today}`);
      }

      // ✅ 3. Fill missing past days if any gap exists
      const firstRecord = await this.salahRecordModel
        .findOne()
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
          const exists = await this.salahRecordModel.exists({ date: dateStr });
          if (!exists) missingDates.push(dateStr);
        }

        if (missingDates.length > 0) {
          const newRecords = missingDates.map((date) => ({
            date,
            prayers: defaultPrayers,
          }));
          await this.salahRecordModel.insertMany(newRecords);
          this.logger.log(
            `🆕 Created ${newRecords.length} missing record(s): ${missingDates.join(', ')}`,
          );
        }
      }
    }

    // ✅ 4. Load all past records and update unmarked rakats as “Missed”
    const pastRecords = await this.salahRecordModel.find({
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

    this.logger.log(`🟠 Marked missed Salahs in ${modifiedCount} record(s).`);
    this.logger.log('🏁 Daily Salah tracker job completed.');
  }
}
