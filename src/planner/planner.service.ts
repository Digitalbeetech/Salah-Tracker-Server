import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Planner } from './schemas/planner.schema';

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(Planner.name)
    private readonly plannerModel: Model<Planner>,
  ) {}

  async create(data: { name: string; status?: string }, userId: string) {
    const payload = {
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    };
    return this.plannerModel.create(payload);
  }

  async findAll(userId: string) {
    if (!userId) throw new Error('User ID is required');

    return this.plannerModel
      .find({
        userId: new mongoose.Types.ObjectId(userId), // ✅ filter by user
      })
      .exec();
  }

  async updateStatus(id: string, status: string, userId: string) {
    return this.plannerModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
