import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateSalahTrackerDto } from './dto/create-salah-tracker.dto';
import { UpdateSalahTrackerDto } from './dto/update-salah-tracker.dto';
import { SalahRecord } from './schemas/salah-tracker.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SalahTrackerService {
  constructor(
    @InjectModel(SalahRecord.name)
    private readonly salahRecordModel: Model<SalahRecord>,
  ) {}

  // ✅ Create new record (prevent duplicate for same date & user)
  // async create(
  //   createSalahTrackerDto: CreateSalahTrackerDto,
  //   tokenAccess: string,
  //   userId: string,
  // ) {
  //   const { date, plannerId } = createSalahTrackerDto;

  //   // 🔹 Decode and verify token
  //   const decoded = await this.decodeExternalToken(tokenAccess);

  //   // 🔹 Attach user ID from token to the DTO
  //   createSalahTrackerDto['userId'] = new mongoose.Types.ObjectId(
  //     userId ? userId : decoded?._id,
  //   );

  //   createSalahTrackerDto['plannerId'] = new mongoose.Types.ObjectId(plannerId);

  //   createSalahTrackerDto['createdBy'] = new mongoose.Types.ObjectId(
  //     decoded?._id,
  //   );

  //   if (!createSalahTrackerDto['userId']) {
  //     throw new UnauthorizedException('User ID not found in token');
  //   }

  //   // 🔹 Check if record already exists for same user & date
  //   const existingRecord = await this.salahRecordModel.findOne({
  //     date,
  //     userId: createSalahTrackerDto['userId'],
  //   });

  //   if (existingRecord) {
  //     throw new ConflictException(
  //       `A record already exists for this user on date ${date}`,
  //     );
  //   }

  //   // 🔹 Save new record
  //   const newRecord = new this.salahRecordModel(createSalahTrackerDto);
  //   return await newRecord.save();
  // }

  async create(
    createSalahTrackerDto: CreateSalahTrackerDto,
    tokenAccess: string,
    userId?: string,
  ) {
    const { date, plannerId, prayers } = createSalahTrackerDto;

    // 🔹 Decode token and get userId
    const decoded = await this.decodeExternalToken(tokenAccess);
    const resolvedUserId = new mongoose.Types.ObjectId(userId || decoded?._id);

    if (!resolvedUserId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    // 🔹 Attach IDs to DTO
    const resolvedPlannerId = new mongoose.Types.ObjectId(plannerId);
    createSalahTrackerDto['userId'] = resolvedUserId;
    createSalahTrackerDto['plannerId'] = resolvedPlannerId;
    createSalahTrackerDto['createdBy'] = new mongoose.Types.ObjectId(
      decoded?._id,
    );

    // 🔹 Map prayers and only attach plannerId to additionalSalahFlag = true
    createSalahTrackerDto.prayers = prayers.map((item) => ({
      ...item,
      plannerId: item.additionalSalahFlag ? resolvedPlannerId : null,
    }));

    // 🔹 Check for existing record (same date + user)
    const existingRecord = await this.salahRecordModel.findOne({
      date,
      userId: resolvedUserId,
    });

    if (existingRecord) {
      // 🔹 Update existing record
      const updatedRecord = await this.salahRecordModel
        .findByIdAndUpdate(
          existingRecord._id,
          { $set: createSalahTrackerDto },
          { new: true },
        )
        .populate('plannerId') // ✅ populate planner reference
        .populate('prayers.plannerId'); // ✅ populate nested planner

      return {
        message: `✅ Existing record updated for user on date ${date}`,
        data: updatedRecord,
      };
    }

    // 🔹 Create new record
    const newRecord = new this.salahRecordModel(createSalahTrackerDto);
    const savedRecord = await newRecord.save();

    // ✅ Populate planner data in response
    const populatedRecord = await savedRecord.populate([
      { path: 'plannerId' },
      { path: 'prayers.plannerId' },
    ]);

    return {
      message: `🆕 New record created for user on date ${date}`,
      data: populatedRecord,
    };
  }

  // ✅ Salah Record Service (Updated)
  async findByMonth(month: string, tokenAccess: string, userApiId?: string) {
    const decoded = await this.decodeExternalToken(tokenAccess);
    const userId = userApiId
      ? new mongoose.Types.ObjectId(userApiId)
      : new mongoose.Types.ObjectId(decoded?._id);

    if (!userId) throw new UnauthorizedException('User ID not found in token');

    try {
      const [year, monthNum] = month.split('-').map(Number);
      if (isNaN(year) || isNaN(monthNum))
        throw new BadRequestException(
          'Invalid month format (YYYY-MM expected)',
        );

      const formatDate = (d: Date) => d.toISOString().split('T')[0];

      // Selected month range
      const startOfSelected = new Date(year, monthNum - 1, 1);
      const endOfSelected = new Date(year, monthNum, 0);

      // Last 6 months range
      const startOfLast6 = new Date(year, monthNum - 7, 1);
      const endOfLast6 = new Date(year, monthNum - 1, 0);

      const [selectedMonthRecords, lastSixMonthsRecords] = await Promise.all([
        this.salahRecordModel
          .find({
            userId,
            date: {
              $gte: formatDate(startOfSelected),
              $lte: formatDate(endOfSelected),
            },
          })
          .sort({ date: 1 }),
        this.salahRecordModel
          .find({
            userId,
            date: {
              $gte: formatDate(startOfLast6),
              $lte: formatDate(endOfLast6),
            },
          })
          .sort({ date: 1 }),
      ]);

      return {
        selectedMonth: {
          range: {
            start: formatDate(startOfSelected),
            end: formatDate(endOfSelected),
          },
          records: selectedMonthRecords,
        },
        lastSixMonths: {
          range: {
            start: formatDate(startOfLast6),
            end: formatDate(endOfLast6),
          },
          records: lastSixMonthsRecords,
        },
      };
    } catch (error) {
      console.error('Error in findByMonth:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByYear(year: string, tokenAccess: string, userApiId?: string) {
    const decoded = await this.decodeExternalToken(tokenAccess);
    const userId = userApiId
      ? new mongoose.Types.ObjectId(userApiId)
      : new mongoose.Types.ObjectId(decoded?._id);

    if (!userId) throw new UnauthorizedException('User ID not found in token');

    try {
      const yearNum = Number(year);
      if (isNaN(yearNum)) throw new BadRequestException('Invalid year format');

      const startOfYear = new Date(yearNum, 0, 1);
      const endOfYear = new Date(yearNum, 11, 31);

      const startOfPrevYear = new Date(yearNum - 1, 0, 1);
      const endOfPrevYear = new Date(yearNum - 1, 11, 31);

      const formatDate = (d: Date) => d.toISOString().split('T')[0];

      const [currentYearRecords, lastYearRecords] = await Promise.all([
        this.salahRecordModel
          .find({
            userId,
            date: {
              $gte: formatDate(startOfYear),
              $lte: formatDate(endOfYear),
            },
          })
          .sort({ date: 1 }),
        this.salahRecordModel
          .find({
            userId,
            date: {
              $gte: formatDate(startOfPrevYear),
              $lte: formatDate(endOfPrevYear),
            },
          })
          .sort({ date: 1 }),
      ]);

      const groupByMonth = (records: any[]) =>
        records.reduce((acc, record) => {
          const monthKey = record.date.slice(0, 7)?.split('-')[1];
          if (!acc[monthKey]) acc[monthKey] = [];
          acc[monthKey].push(record);
          return acc;
        }, {});

      return {
        currentYear: {
          range: {
            start: formatDate(startOfYear),
            end: formatDate(endOfYear),
          },
          groupedByMonth: groupByMonth(currentYearRecords),
          totalRecords: currentYearRecords.length,
        },
        lastYear: {
          range: {
            start: formatDate(startOfPrevYear),
            end: formatDate(endOfPrevYear),
          },
          groupedByMonth: groupByMonth(lastYearRecords),
          totalRecords: lastYearRecords.length,
        },
      };
    } catch (error) {
      console.error('Error in findByYear:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByPlanner(date: string, tokenAccess: string, userApiId?: string) {
    const decoded = await this.decodeExternalToken(tokenAccess);
    const userId = userApiId
      ? new mongoose.Types.ObjectId(userApiId)
      : new mongoose.Types.ObjectId(decoded?._id);

    if (!userId) throw new UnauthorizedException('User ID not found in token');

    const record = await this.salahRecordModel.findOne({
      date,
      userId,
    });
    if (!record)
      throw new NotFoundException(`No Salah record found for date ${date}`);

    return record;
  }

  async findByDate(date: string, tokenAccess: string, userApiId?: string) {
    const decoded = await this.decodeExternalToken(tokenAccess);
    const userId = userApiId
      ? new mongoose.Types.ObjectId(userApiId)
      : new mongoose.Types.ObjectId(decoded?._id);

    if (!userId) throw new UnauthorizedException('User ID not found in token');

    const record = await this.salahRecordModel.findOne({ date, userId });
    if (!record)
      throw new NotFoundException(`No Salah record found for date ${date}`);

    return record;
  }

  async findAll() {
    return this.salahRecordModel.find().sort({ createdAt: -1 }).exec();
  }
  // async findAll(tokenAccess: string, userApiId?: string) {
  //   const decoded = await this.decodeExternalToken(tokenAccess);
  //   const userId = userApiId
  //     ? new mongoose.Types.ObjectId(userApiId)
  //     : new mongoose.Types.ObjectId(decoded?._id);

  //   if (!userId) throw new UnauthorizedException('User ID not found in token');

  //   return this.salahRecordModel
  //     .find({ userId })
  //     .sort({ createdAt: -1 })
  //     .exec();
  // }

  // ✅ Update record (user-based)
  async update(
    id: string,
    tokenAccess: string,
    updateDto: UpdateSalahTrackerDto,
  ) {
    const decoded = await this.decodeExternalToken(tokenAccess);
    const userId = new mongoose.Types.ObjectId(decoded?._id);

    if (!userId) throw new UnauthorizedException('User ID not found in token');

    const record = await this.salahRecordModel
      .findOne({ _id: id, userId })
      .exec();
    if (!record)
      throw new UnauthorizedException(
        'You are not authorized to update this record or it does not exist',
      );

    Object.assign(record, updateDto);
    await record.save();
    return record;
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

  async findOne(id: string) {
    const record = await this.salahRecordModel
      .findById(id)
      // .populate('user', 'username email')
      .exec();

    if (!record)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return record;
  }

  async remove(id: string) {
    const deleted = await this.salahRecordModel.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return { message: 'Salah record deleted successfully' };
  }
}
