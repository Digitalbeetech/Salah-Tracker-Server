import { Document, Types } from 'mongoose';
export declare class Rakat {
    farz: boolean;
    number: number;
    markAsOffered: string | null;
}
export declare const RakatSchema: import("mongoose").Schema<Rakat, import("mongoose").Model<Rakat, any, any, any, Document<unknown, any, Rakat, any, {}> & Rakat & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Rakat, Document<unknown, {}, import("mongoose").FlatRecord<Rakat>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Rakat> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Prayer {
    name: string;
    rakats: Rakat[];
    key: string;
    subtext: string;
    active?: boolean;
}
export declare const PrayerSchema: import("mongoose").Schema<Prayer, import("mongoose").Model<Prayer, any, any, any, Document<unknown, any, Prayer, any, {}> & Prayer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Prayer, Document<unknown, {}, import("mongoose").FlatRecord<Prayer>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Prayer> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class SalahRecord extends Document {
    date: string;
    prayers: Prayer[];
}
export declare const SalahRecordSchema: import("mongoose").Schema<SalahRecord, import("mongoose").Model<SalahRecord, any, any, any, Document<unknown, any, SalahRecord, any, {}> & SalahRecord & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SalahRecord, Document<unknown, {}, import("mongoose").FlatRecord<SalahRecord>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SalahRecord> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
