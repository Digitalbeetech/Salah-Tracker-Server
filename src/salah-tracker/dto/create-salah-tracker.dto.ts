import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRakatDto {
  @IsBoolean()
  @IsNotEmpty()
  farz: boolean;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsOptional()
  markAsOffered?: string | null;

  @IsString()
  @IsOptional()
  time?: string | null;
}

export class CreatePrayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRakatDto)
  rakats: CreateRakatDto[];

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  subtext: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class CreateSalahTrackerDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrayerDto)
  prayers: CreatePrayerDto[];

  //   @IsMongoId()
  //   @IsNotEmpty()
  //   user: string; // 👈 Must provide user ID
}
