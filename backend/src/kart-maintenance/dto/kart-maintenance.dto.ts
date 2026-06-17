import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { KartMaintenancePriority, KartMaintenanceStatus } from '@prisma/client';

export class CreateKartMaintenanceDto {
  @IsUUID()
  kartFleetId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsEnum(KartMaintenancePriority)
  priority?: KartMaintenancePriority;

  @IsOptional()
  @IsEnum(KartMaintenanceStatus)
  status?: KartMaintenanceStatus;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateKartMaintenanceDto {
  @IsOptional()
  @IsUUID()
  kartFleetId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsEnum(KartMaintenancePriority)
  priority?: KartMaintenancePriority;

  @IsOptional()
  @IsEnum(KartMaintenanceStatus)
  status?: KartMaintenanceStatus;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
