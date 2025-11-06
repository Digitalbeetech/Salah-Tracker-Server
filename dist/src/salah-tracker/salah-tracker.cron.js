"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SalahTrackerCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalahTrackerCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const salah_tracker_schema_1 = require("./schemas/salah-tracker.schema");
let SalahTrackerCron = SalahTrackerCron_1 = class SalahTrackerCron {
    constructor(salahRecordModel) {
        this.salahRecordModel = salahRecordModel;
        this.logger = new common_1.Logger(SalahTrackerCron_1.name);
    }
    async handleDailySalahTracking() {
        this.logger.log('Running daily Salah tracker job...');
        const today = new Date().toISOString().split('T')[0];
        const todayDate = new Date(today);
        this.logger.log(`Today's date: ${today}`);
        const defaultPrayers = [
            {
                name: 'Fajr',
                key: 'Fajr',
                subtext: 'Sunrise at 06:40',
                rakats: [
                    { farz: false, number: 2, markAsOffered: null },
                    { farz: true, number: 2, markAsOffered: null },
                ],
            },
            {
                name: 'Zuhr',
                key: 'Dhuhr',
                subtext: 'Pray Now',
                rakats: [
                    { farz: false, number: 4, markAsOffered: null },
                    { farz: true, number: 4, markAsOffered: null },
                    { farz: false, number: 2, markAsOffered: null },
                ],
            },
            {
                name: 'Asr',
                key: 'Asr',
                subtext: 'Before Sunset',
                rakats: [
                    { farz: false, number: 4, markAsOffered: null },
                    { farz: true, number: 4, markAsOffered: null },
                ],
            },
            {
                name: 'Maghrib',
                key: 'Maghrib',
                subtext: 'After Sunset',
                rakats: [
                    { farz: true, number: 3, markAsOffered: null },
                    { farz: false, number: 2, markAsOffered: null },
                ],
            },
            {
                name: 'Isha',
                key: 'Isha',
                subtext: 'Before Midnight',
                rakats: [
                    { farz: false, number: 4, markAsOffered: null },
                    { farz: true, number: 4, markAsOffered: null },
                    { farz: false, number: 3, markAsOffered: null },
                    { farz: false, number: 2, markAsOffered: null },
                ],
            },
        ];
        const totalRecords = await this.salahRecordModel.countDocuments();
        if (totalRecords === 0) {
            const yesterday = new Date(todayDate);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            await this.salahRecordModel.insertMany([
                { date: yesterdayStr, prayers: defaultPrayers },
                { date: today, prayers: defaultPrayers },
            ]);
            this.logger.log(`🆕 Created first two records: ${yesterdayStr}, ${today}`);
        }
        else {
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
            const firstRecord = await this.salahRecordModel
                .findOne()
                .sort({ date: 1 })
                .lean();
            if (firstRecord) {
                const firstDate = new Date(firstRecord.date);
                const missingDates = [];
                for (let d = new Date(firstDate); d < todayDate; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split('T')[0];
                    const exists = await this.salahRecordModel.exists({ date: dateStr });
                    if (!exists)
                        missingDates.push(dateStr);
                }
                if (missingDates.length > 0) {
                    const newRecords = missingDates.map((date) => ({
                        date,
                        prayers: defaultPrayers,
                    }));
                    await this.salahRecordModel.insertMany(newRecords);
                    this.logger.log(`🆕 Created ${newRecords.length} missing record(s): ${missingDates.join(', ')}`);
                }
            }
        }
        const pastRecords = await this.salahRecordModel.find({
            date: { $lt: today },
        });
        let modifiedCount = 0;
        for (const record of pastRecords) {
            let updated = false;
            for (const prayer of record.prayers) {
                for (const rakat of prayer.rakats) {
                    if ((!rakat.markAsOffered ||
                        rakat.markAsOffered === '' ||
                        rakat.markAsOffered === null) &&
                        rakat.farz) {
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
};
exports.SalahTrackerCron = SalahTrackerCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalahTrackerCron.prototype, "handleDailySalahTracking", null);
exports.SalahTrackerCron = SalahTrackerCron = SalahTrackerCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(salah_tracker_schema_1.SalahRecord.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SalahTrackerCron);
//# sourceMappingURL=salah-tracker.cron.js.map