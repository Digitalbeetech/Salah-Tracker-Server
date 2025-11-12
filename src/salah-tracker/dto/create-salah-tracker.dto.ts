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
import { Types } from 'mongoose';

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
  @IsOptional()
  time?: string | null;

  @IsString()
  @IsNotEmpty()
  additionalSalahFlag?: Boolean | false;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  subtext: string;

  @IsString()
  @IsOptional()
  plannerId: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class CreateSalahTrackerDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  // ✅ Use IsMongoId for validation and Types.ObjectId for typing
  @IsMongoId()
  @IsNotEmpty()
  plannerId: Types.ObjectId;

  // ✅ Use IsMongoId for validation and Types.ObjectId for typing
  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrayerDto)
  prayers: CreatePrayerDto[];
}
