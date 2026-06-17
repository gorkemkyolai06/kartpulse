import { Module } from '@nestjs/common';
import { TrackMaintenanceController } from './track-maintenance.controller';
import { TrackMaintenanceService } from './track-maintenance.service';

@Module({
  controllers: [TrackMaintenanceController],
  providers: [TrackMaintenanceService],
})
export class TrackMaintenanceModule {}
