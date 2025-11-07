import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Rakat {
  @Prop({ required: true })
  farz: boolean;

  @Prop({ required: true })
  number: number;

  @Prop({ type: String, default: null })
  markAsOffered: string | null;

  @Prop({ type: String, default: null })
  time: string | null;
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

  @Prop({ required: false })
  subtext: string;

  @Prop({ type: Boolean, default: false })
  active?: boolean;
}
export const PrayerSchema = SchemaFactory.createForClass(Prayer);

@Schema({ timestamps: true })
export class SalahRecord extends Document {
  @Prop({ required: true })
  date: string; // e.g. "2025-11-05"

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false, default: null })
  plannerId: string;

  @Prop({ type: [PrayerSchema], required: true })
  prayers: Prayer[];
}

export const SalahRecordSchema = SchemaFactory.createForClass(SalahRecord);

// ✅ Compound unique index to prevent duplicates only for same user & date
// SalahRecordSchema.index({ userId: 1, date: 1 }, { unique: true });
