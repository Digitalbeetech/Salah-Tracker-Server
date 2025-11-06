import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Rakat {
  @Prop({ required: true })
  farz: boolean;

  @Prop({ required: true })
  number: number;

  @Prop({ type: String, default: null })
  markAsOffered: string | null;
}

export const RakatSchema = SchemaFactory.createForClass(Rakat);

@Schema()
export class Prayer {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [RakatSchema], required: true })
  rakats: Rakat[];

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  subtext: string;

  @Prop({ type: Boolean, default: false })
  active?: boolean;
}

export const PrayerSchema = SchemaFactory.createForClass(Prayer);

@Schema({ timestamps: true })
export class SalahRecord extends Document {
  @Prop({ required: true })
  date: string; // e.g. "2025-11-03"

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [PrayerSchema], required: true })
  prayers: Prayer[];

  // // 👇 Link Salah Record to a User
  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // user: Types.ObjectId;
}

export const SalahRecordSchema = SchemaFactory.createForClass(SalahRecord);

// Optional: Create a compound unique index (user + date)
SalahRecordSchema.index(
  {
    // user: 1,
    date: 1,
  },
  { unique: true },
);
