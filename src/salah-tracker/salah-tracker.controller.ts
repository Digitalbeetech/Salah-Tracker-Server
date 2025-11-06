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

  @Get('month/:month')
  async findByMonth(
    @Param('month') month: string,
    @Headers('token') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.findByMonth(month, tokenAccess);
  }

  @Get('date/:date')
  async findByDate(
    @Param('date') date: string,
    @Headers('token') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.findByDate(date, tokenAccess);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSalahTrackerDto,
    @Headers('token') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.update(id, tokenAccess, dto);
  }

  // Get all Salah Records
  @Get()
  async findAll() {
    return await this.salahTrackerService.findAll();
  }

  // Get a single Salah Record by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.salahTrackerService.findOne(id);
  }

  // Delete Salah Record by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.salahTrackerService.remove(id);
  }
}
