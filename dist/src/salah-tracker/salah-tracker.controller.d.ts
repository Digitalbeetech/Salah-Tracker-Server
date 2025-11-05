import { SalahTrackerService } from './salah-tracker.service';
import { CreateSalahTrackerDto } from './dto/create-salah-tracker.dto';
import { UpdateSalahTrackerDto } from './dto/update-salah-tracker.dto';
export declare class SalahTrackerController {
    private readonly salahTrackerService;
    constructor(salahTrackerService: SalahTrackerService);
    create(createSalahTrackerDto: CreateSalahTrackerDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/salah-tracker.schema").SalahRecord, {}, {}> & import("./schemas/salah-tracker.schema").SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/salah-tracker.schema").SalahRecord, {}, {}> & import("./schemas/salah-tracker.schema").SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findBymonth(month: string): Promise<{
        selectedMonth: {
            range: {
                start: string;
                end: string;
            };
            records: (import("mongoose").Document<unknown, {}, import("./schemas/salah-tracker.schema").SalahRecord, {}, {}> & import("./schemas/salah-tracker.schema").SalahRecord & Required<{
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
            records: (import("mongoose").Document<unknown, {}, import("./schemas/salah-tracker.schema").SalahRecord, {}, {}> & import("./schemas/salah-tracker.schema").SalahRecord & Required<{
                _id: unknown;
            }> & {
                __v: number;
            })[];
        };
    }>;
    findByDate(date: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/salah-tracker.schema").SalahRecord, {}, {}> & import("./schemas/salah-tracker.schema").SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/salah-tracker.schema").SalahRecord, {}, {}> & import("./schemas/salah-tracker.schema").SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, updateSalahTrackerDto: UpdateSalahTrackerDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/salah-tracker.schema").SalahRecord, {}, {}> & import("./schemas/salah-tracker.schema").SalahRecord & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
