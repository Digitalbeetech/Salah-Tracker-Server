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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalahTrackerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const salah_tracker_schema_1 = require("./schemas/salah-tracker.schema");
let SalahTrackerService = class SalahTrackerService {
    constructor(salahRecordModel) {
        this.salahRecordModel = salahRecordModel;
    }
    async create(createSalahTrackerDto) {
        const { date, } = createSalahTrackerDto;
        const existingRecord = await this.salahRecordModel
            .findOne({
            date,
        })
            .exec();
        if (existingRecord) {
            throw new common_1.ConflictException(`A record already exists on date ${date}`);
        }
        const newRecord = new this.salahRecordModel(createSalahTrackerDto);
        return await newRecord.save();
    }
    async findAll() {
        return await this.salahRecordModel
            .find()
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByMonth(month) {
        try {
            const [year, monthNum] = month.split('-').map(Number);
            const formatDate = (d) => d.toISOString().split('T')[0];
            const startOfSelected = new Date(year, monthNum - 1, 1);
            const endOfSelected = new Date(year, monthNum, 0);
            const selectedStart = formatDate(startOfSelected);
            const selectedEnd = formatDate(endOfSelected);
            const startOfLast6 = new Date(year, monthNum - 7, 1);
            const endOfLast6 = new Date(year, monthNum - 1, 0);
            const last6Start = formatDate(startOfLast6);
            const last6End = formatDate(endOfLast6);
            console.log(`Selected month: ${selectedStart} → ${selectedEnd}`);
            console.log(`Last 6 months: ${last6Start} → ${last6End}`);
            const [selectedMonthRecords, lastSixMonthsRecords] = await Promise.all([
                this.salahRecordModel
                    .find({ date: { $gte: selectedStart, $lte: selectedEnd } })
                    .sort({ date: 1 })
                    .exec(),
                this.salahRecordModel
                    .find({ date: { $gte: last6Start, $lte: last6End } })
                    .sort({ date: 1 })
                    .exec(),
            ]);
            return {
                selectedMonth: {
                    range: { start: selectedStart, end: selectedEnd },
                    records: selectedMonthRecords,
                },
                lastSixMonths: {
                    range: { start: last6Start, end: last6End },
                    records: lastSixMonthsRecords,
                },
            };
        }
        catch (error) {
            console.error('Error in findByMonth:', error);
            throw new common_1.InternalServerErrorException(error.message || 'Error fetching monthly records');
        }
    }
    async findOne(id) {
        const record = await this.salahRecordModel
            .findById(id)
            .exec();
        if (!record)
            throw new common_1.NotFoundException(`Salah record with ID ${id} not found`);
        return record;
    }
    async findByDate(date) {
        const filter = { date };
        const record = await this.salahRecordModel.findOne(filter).exec();
        if (!record)
            throw new common_1.NotFoundException(`No Salah record found for date ${date}`);
        return record;
    }
    async update(id, updateSalahTrackerDto) {
        const updated = await this.salahRecordModel
            .findByIdAndUpdate(id, updateSalahTrackerDto, { new: true })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Salah record with ID ${id} not found`);
        return updated;
    }
    async remove(id) {
        const deleted = await this.salahRecordModel.findByIdAndDelete(id).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Salah record with ID ${id} not found`);
        return { message: 'Salah record deleted successfully' };
    }
};
exports.SalahTrackerService = SalahTrackerService;
exports.SalahTrackerService = SalahTrackerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(salah_tracker_schema_1.SalahRecord.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SalahTrackerService);
//# sourceMappingURL=salah-tracker.service.js.map