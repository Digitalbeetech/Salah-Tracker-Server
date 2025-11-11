import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Planner extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['Pending', 'Completed'], default: 'Pending' })
  status: string;
}

export const PlannerSchema = SchemaFactory.createForClass(Planner);

// PlannerSchema.index({ name: 1 }, { unique: true });
