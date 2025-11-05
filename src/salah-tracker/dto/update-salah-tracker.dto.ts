import { PartialType } from '@nestjs/mapped-types';
import { CreateSalahTrackerDto } from './create-salah-tracker.dto';

export class UpdateSalahTrackerDto extends PartialType(CreateSalahTrackerDto) {}
