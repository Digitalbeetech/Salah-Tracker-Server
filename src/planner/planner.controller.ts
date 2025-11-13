import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { PlannerService } from './planner.service';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Post()
  async create(
    @Body() body: { name: string; status?: string; planType?: string },
    @Query('userId') userId: string,
    @Headers('Authorization') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.plannerService.create(body, userId, tokenAccess);
  }

  @Get(`date/:date`)
  async findAll(@Param('date') date: string, @Query('userId') userId: string) {
    // console.log('date', date, userId);
    return this.plannerService.findAll(date, userId);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; planType: string },
    @Query('userId') userId: string,
  ) {
    return this.plannerService.updateStatus(
      id,
      { status: body?.status, planType: body?.planType },
      userId,
    );
  }
}
