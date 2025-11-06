import { IsOptional, ValidateNested, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePrayerDto } from './create-salah-tracker.dto';

export class UpdateSalahTrackerDto {
  @IsString()
  @IsOptional()
  date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrayerDto)
  @IsOptional()
  prayers?: CreatePrayerDto[];
}
