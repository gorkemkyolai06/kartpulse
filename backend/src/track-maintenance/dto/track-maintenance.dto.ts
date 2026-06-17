import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TrackMaintenanceCategory, TrackMaintenanceStatus } from '@prisma/client';

export class CreateTrackMaintenanceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TrackMaintenanceCategory)
  category?: TrackMaintenanceCategory;

  @IsOptional()
  @IsString()
  section?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(TrackMaintenanceStatus)
  status?: TrackMaintenanceStatus;
}

export class UpdateTrackMaintenanceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TrackMaintenanceCategory)
  category?: TrackMaintenanceCategory;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(TrackMaintenanceStatus)
  status?: TrackMaintenanceStatus;
}
