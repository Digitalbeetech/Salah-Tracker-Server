import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Planner } from './schemas/planner.schema';

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(Planner.name)
    private readonly plannerModel: Model<Planner>,
  ) {}

  async create(data: { name: string; status?: string }) {
    return this.plannerModel.create(data);
  }

  async findAll(date: string) {
    // Convert string date (YYYY-MM-DD) to start and end of day
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    return this.plannerModel
      .find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
      .exec();
  }

  async updateStatus(id: string, status: string) {
    return this.plannerModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
