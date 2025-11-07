import { Controller, Post, Get, Body, Patch, Param } from '@nestjs/common';
import { PlannerService } from './planner.service';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Post()
  async create(@Body() body: { name: string; status?: string }) {
    return this.plannerService.create(body);
  }

  @Get()
  async findAll() {
    return this.plannerService.findAll();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.plannerService.updateStatus(id, body.status);
  }
}
