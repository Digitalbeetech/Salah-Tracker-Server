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
    @Body() body: { name: string; status?: string },
    @Query('userId') userId: string,
    @Headers('Authorization') token: string,
  ) {
    const tokenAccess = token.split(' ')[1]; // Removes "Bearer "
    if (!tokenAccess) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.plannerService.create(body, userId, tokenAccess);
  }

  @Get()
  async findAll(@Query('userId') userId: string) {
    return this.plannerService.findAll(userId);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Query('userId') userId: string,
  ) {
    return this.plannerService.updateStatus(id, body.status, userId);
  }
}
