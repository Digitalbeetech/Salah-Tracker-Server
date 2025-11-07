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

  async findAll() {
    return this.plannerModel.find().exec();
  }

  async updateStatus(id: string, status: string) {
    return this.plannerModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
