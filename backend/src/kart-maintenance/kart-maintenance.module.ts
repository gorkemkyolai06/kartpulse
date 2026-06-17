import { Module } from '@nestjs/common';
import { KartMaintenanceController } from './kart-maintenance.controller';
import { KartMaintenanceService } from './kart-maintenance.service';

@Module({
  controllers: [KartMaintenanceController],
  providers: [KartMaintenanceService],
})
export class KartMaintenanceModule {}
