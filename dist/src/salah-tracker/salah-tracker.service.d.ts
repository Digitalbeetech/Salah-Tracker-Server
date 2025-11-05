import { Model } from 'mongoose';
import { CreateSalahTrackerDto } from './dto/create-salah-tracker.dto';
import { UpdateSalahTrackerDto } from './dto/update-salah-tracker.dto';
import { SalahRecord } from './schemas/salah-tracker.schema';
export declare class SalahTrackerService {
    private readonly salahRecordModel;
    constructor(salahRecordModel: Model<SalahRecord>);
    create(createSalahTrackerDto: CreateSalahTrackerDto): Promise<import("mongoose").Document<unknown, {}, SalahRecord, {}, {}> & SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, SalahRecord, {}, {}> & SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findByMonth(month: string): Promise<{
        selectedMonth: {
            range: {
                start: string;
                end: string;
            };
            records: (import("mongoose").Document<unknown, {}, SalahRecord, {}, {}> & SalahRecord & Required<{
                _id: unknown;
            }> & {
                __v: number;
            })[];
        };
        lastSixMonths: {
            range: {
                start: string;
                end: string;
            };
            records: (import("mongoose").Document<unknown, {}, SalahRecord, {}, {}> & SalahRecord & Required<{
                _id: unknown;
            }> & {
                __v: number;
            })[];
        };
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, SalahRecord, {}, {}> & SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findByDate(date: string): Promise<import("mongoose").Document<unknown, {}, SalahRecord, {}, {}> & SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, updateSalahTrackerDto: UpdateSalahTrackerDto): Promise<import("mongoose").Document<unknown, {}, SalahRecord, {}, {}> & SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
