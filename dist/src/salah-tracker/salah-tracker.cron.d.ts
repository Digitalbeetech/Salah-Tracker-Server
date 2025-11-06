import { Model } from 'mongoose';
import { SalahRecord } from './schemas/salah-tracker.schema';
export declare class SalahTrackerCron {
    private readonly salahRecordModel;
    private readonly logger;
    constructor(salahRecordModel: Model<SalahRecord>);
    markUnmarkedAsMissed(): Promise<void>;
}
