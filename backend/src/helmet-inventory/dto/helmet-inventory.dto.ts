import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { HelmetStatus, HelmetType } from '@prisma/client';

export class CreateHelmetInventoryDto {
  @IsString()
  name: string;

  @IsEnum(HelmetType)
  helmetType: HelmetType;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsEnum(HelmetStatus)
  status?: HelmetStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateHelmetInventoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(HelmetType)
  helmetType?: HelmetType;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsEnum(HelmetStatus)
  status?: HelmetStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
