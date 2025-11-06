import { IsOptional, IsString } from 'class-validator';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
