import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Planner, PlannerSchema } from './schemas/planner.schema';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Planner.name, schema: PlannerSchema }]),
  ],
  controllers: [PlannerController],
  providers: [PlannerService],
})
export class PlannerModule {}
