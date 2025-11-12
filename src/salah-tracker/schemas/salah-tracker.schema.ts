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

  @Prop({ type: String, default: null })
  time: string | null;
}
export const RakatSchema = SchemaFactory.createForClass(Rakat);

@Schema()
export class Prayer {
  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ type: [RakatSchema], required: true })
  rakats: Rakat[];

  @Prop({ type: String, default: null })
  time: string | null;

  @Prop({ type: Boolean, default: false })
  additionalSalahFlag?: boolean;

  @Prop({ required: true })
  key: string;

  @Prop({ required: false })
  subtext: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Planner',
    required: false,
    default: null,
  })
  plannerId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  active?: boolean;
}
export const PrayerSchema = SchemaFactory.createForClass(Prayer);
// PrayerSchema.index({ name: 1 }, { unique: true });

@Schema({ timestamps: true })
export class SalahRecord extends Document {
  @Prop({ required: true })
  date: string; // e.g. "2025-11-05"

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Planner',
    required: false,
    default: null,
  })
  plannerId: Types.ObjectId;

  @Prop({ type: [PrayerSchema], required: true })
  prayers: Prayer[];
}

export const SalahRecordSchema = SchemaFactory.createForClass(SalahRecord);

// SalahRecordSchema.pre('save', function (next) {
//   const prayerNames = this.prayers.map((p) => p.name);
//   const duplicates = prayerNames.filter(
//     (name, idx) => prayerNames.indexOf(name) !== idx,
//   );

//   if (duplicates.length > 0) {
//     return next(
//       new Error(
//         `Duplicate prayer names found: ${[...new Set(duplicates)].join(', ')}`,
//       ),
//     );
//   }

//   next();
// });
