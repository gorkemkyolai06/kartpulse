import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KartStatus, KartType } from '@prisma/client';

export class CreateKartFleetDto {
  @IsString()
  name: string;

  @IsString()
  section: string;

  @IsOptional()
  @IsEnum(KartType)
  kartType?: KartType;

  @IsOptional()
  @IsString()
  engineSpec?: string;

  @IsOptional()
  @IsEnum(KartStatus)
  status?: KartStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateKartFleetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsEnum(KartType)
  kartType?: KartType;

  @IsOptional()
  @IsString()
  engineSpec?: string;

  @IsOptional()
  @IsEnum(KartStatus)
  status?: KartStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
