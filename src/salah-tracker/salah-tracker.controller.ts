import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { SalahTrackerService } from './salah-tracker.service';
import { CreateSalahTrackerDto } from './dto/create-salah-tracker.dto';
import { UpdateSalahTrackerDto } from './dto/update-salah-tracker.dto';

@Controller('salah-tracker')
export class SalahTrackerController {
  constructor(private readonly salahTrackerService: SalahTrackerService) {}

  // Create a new Salah Record
  @Post()
  async create(
    @Body() createSalahTrackerDto: CreateSalahTrackerDto,
    @Headers('token') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return await this.salahTrackerService.create(
      createSalahTrackerDto,
      tokenAccess,
    );
  }

  // Get all Salah Records
  @Get()
  async findAll() {
    return await this.salahTrackerService.findAll();
  }

  // ✅ Get record(s) by date
  @Get('month')
  async findBymonth(@Query('month') month: string) {
    return await this.salahTrackerService.findByMonth(month);
  }

  // ✅ Get record(s) by date
  @Get('date/:date')
  async findByDate(
    @Param('date') date: string,
    // @Query('userId') userId?: string,
  ) {
    return await this.salahTrackerService.findByDate(
      date,
      // , userId
    );
  }
  // Get a single Salah Record by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.salahTrackerService.findOne(id);
  }

  // Update Salah Record by ID
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSalahTrackerDto: UpdateSalahTrackerDto,
  ) {
    return await this.salahTrackerService.update(id, updateSalahTrackerDto);
  }

  // Delete Salah Record by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.salahTrackerService.remove(id);
  }
}
