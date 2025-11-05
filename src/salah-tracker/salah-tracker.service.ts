import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSalahTrackerDto } from './dto/create-salah-tracker.dto';
import { UpdateSalahTrackerDto } from './dto/update-salah-tracker.dto';
import { SalahRecord } from './schemas/salah-tracker.schema';

@Injectable()
export class SalahTrackerService {
  constructor(
    @InjectModel(SalahRecord.name)
    private readonly salahRecordModel: Model<SalahRecord>,
  ) {}

  // ✅ Create new record (prevent duplicate for same date & user)
  async create(createSalahTrackerDto: CreateSalahTrackerDto) {
    const {
      date,
      // , user
    } = createSalahTrackerDto;

    const existingRecord = await this.salahRecordModel
      .findOne({
        date,
        // , user
      })
      .exec();
    if (existingRecord) {
      throw new ConflictException(`A record already exists on date ${date}`);
      // throw new ConflictException(
      //   `A record already exists for user ${user} on date ${date}`,
      // );
    }

    const newRecord = new this.salahRecordModel(createSalahTrackerDto);
    return await newRecord.save();
  }

  async findAll() {
    return await this.salahRecordModel
      .find()
      // .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByMonth(month: string) {
    try {
      // Expect month in format "YYYY-MM"
      const [year, monthNum] = month.split('-').map(Number);

      const formatDate = (d: Date) => d.toISOString().split('T')[0];

      // ✅ Selected month range
      const startOfSelected = new Date(year, monthNum - 1, 1);
      const endOfSelected = new Date(year, monthNum, 0);
      const selectedStart = formatDate(startOfSelected);
      const selectedEnd = formatDate(endOfSelected);

      // ✅ Last 6 months range (excluding selected month)
      const startOfLast6 = new Date(year, monthNum - 7, 1); // Go 6 months before the previous month
      const endOfLast6 = new Date(year, monthNum - 1, 0); // Last day before selected month
      const last6Start = formatDate(startOfLast6);
      const last6End = formatDate(endOfLast6);

      console.log(`Selected month: ${selectedStart} → ${selectedEnd}`);
      console.log(`Last 6 months: ${last6Start} → ${last6End}`);

      // Fetch both in parallel
      const [selectedMonthRecords, lastSixMonthsRecords] = await Promise.all([
        this.salahRecordModel
          .find({ date: { $gte: selectedStart, $lte: selectedEnd } })
          .sort({ date: 1 })
          .exec(),
        this.salahRecordModel
          .find({ date: { $gte: last6Start, $lte: last6End } })
          .sort({ date: 1 })
          .exec(),
      ]);

      // Return both sets
      return {
        selectedMonth: {
          range: { start: selectedStart, end: selectedEnd },
          records: selectedMonthRecords,
        },
        lastSixMonths: {
          range: { start: last6Start, end: last6End },
          records: lastSixMonthsRecords,
        },
      };
    } catch (error) {
      console.error('Error in findByMonth:', error);
      throw new InternalServerErrorException(
        error.message || 'Error fetching monthly records',
      );
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

  // ✅ Find by date (optionally filter by user)
  async findByDate(
    date: string,
    // , userId?: string
  ) {
    const filter: any = { date };
    // if (userId) filter.user = userId;

    const record = await this.salahRecordModel.findOne(filter).exec();

    if (!record)
      throw new NotFoundException(`No Salah record found for date ${date}`);
    return record;
  }

  async update(id: string, updateSalahTrackerDto: UpdateSalahTrackerDto) {
    const updated = await this.salahRecordModel
      .findByIdAndUpdate(id, updateSalahTrackerDto, { new: true })
      .exec();

    if (!updated)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.salahRecordModel.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return { message: 'Salah record deleted successfully' };
  }
}
