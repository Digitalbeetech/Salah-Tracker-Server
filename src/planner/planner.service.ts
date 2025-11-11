import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Planner } from './schemas/planner.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(Planner.name)
    private readonly plannerModel: Model<Planner>,
  ) {}

  async create(
    data: { name: string; status?: string },
    userId: string,
    tokenAccess: string,
  ) {
    const decoded = await this.decodeExternalToken(tokenAccess);

    const payload = {
      ...data,
      createdBy: new mongoose.Types.ObjectId(decoded?._id),
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

  // ✅ Helper function to decode and verify external token
  private async decodeExternalToken(tokenAccess: string): Promise<any> {
    if (!tokenAccess) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      // Use the same secret/public key that the other app used to sign the JWT
      const decoded = jwt.verify(tokenAccess, process.env.JWT_SECRET);
      // console.log('✅ Token verified successfully:', decoded);
      return decoded;
    } catch (error) {
      console.error('❌ JWT verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
