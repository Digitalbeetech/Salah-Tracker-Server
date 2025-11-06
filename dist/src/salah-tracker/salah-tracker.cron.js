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
    async markUnmarkedAsMissed() {
        this.logger.log('Running daily Salah missed update job...');
        const today = new Date().toISOString().split('T')[0];
        const records = await this.salahRecordModel.find({
            date: { $lt: today },
        });
        for (const record of records) {
            let updated = false;
            for (const prayer of record.prayers) {
                for (const rakat of prayer.rakats) {
                    if (!rakat.markAsOffered && rakat.farz) {
                        rakat.markAsOffered = 'Missed';
                        updated = true;
                    }
                }
            }
            console.log('record', record);
            if (updated) {
                await record.save();
                this.logger.log(`Updated missed Salahs for record on ${record.date}`);
            }
        }
        this.logger.log('Daily Salah missed update job completed.');
    }
};
exports.SalahTrackerCron = SalahTrackerCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalahTrackerCron.prototype, "markUnmarkedAsMissed", null);
exports.SalahTrackerCron = SalahTrackerCron = SalahTrackerCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(salah_tracker_schema_1.SalahRecord.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SalahTrackerCron);
//# sourceMappingURL=salah-tracker.cron.js.map