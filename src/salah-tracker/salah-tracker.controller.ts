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
    @Query('userId') userId: string,
    @Headers('Authorization') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return await this.salahTrackerService.create(
      createSalahTrackerDto,
      tokenAccess,
      userId,
    );
  }

  // 🕌 Bulk Create Salah Records (multiple dates)
  @Post('bulk')
  async createBulkSalahRecords(
    @Body() body: CreateSalahTrackerDto[],
    @Query('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const results = [];

    // Process each day's data sequentially
    for (const salahData of body) {
      try {
        const result = await this.salahTrackerService.create(
          salahData,
          token,
          userId,
        );
        results.push({
          date: salahData.date,
          success: true,
          message: 'Record created successfully',
          data: result,
        });
      } catch (error) {
        results.push({
          date: salahData.date,
          success: false,
          message: error.message || 'Failed to create record',
        });
      }
    }

    return {
      success: true,
      totalProcessed: results.length,
      summary: results,
    };
  }

  // Get all Salah Records
  @Get()
  async findAll() {
    return await this.salahTrackerService.findAll();
  }

  @Get('month/:month')
  async findByMonth(
    @Param('month') month: string,
    @Headers('Authorization') token: string,
    @Query('userId') userApiId: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.findByMonth(month, tokenAccess, userApiId);
  }

  @Get('year/:year')
  async findByYear(
    @Param('year') year: string,
    @Headers('Authorization') token: string,
    @Query('userId') userApiId: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.findByYear(year, tokenAccess, userApiId);
  }

  @Get('date/:date')
  async findByDate(
    @Param('date') date: string,
    @Headers('Authorization') token: string,
    @Query('userId') userApiId: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.findByDate(date, tokenAccess, userApiId);
  }

  @Get('date/:date')
  async findByPlanner(
    @Param('date') date: string,
    @Headers('Authorization') token: string,
    @Query('userId') userApiId: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.findByPlanner(date, tokenAccess, userApiId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSalahTrackerDto,
    @Headers('Authorization') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.salahTrackerService.update(id, tokenAccess, dto);
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
