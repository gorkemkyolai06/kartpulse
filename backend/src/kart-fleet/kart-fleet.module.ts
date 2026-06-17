import { Module } from '@nestjs/common';
import { KartFleetController } from './kart-fleet.controller';
import { KartFleetService } from './kart-fleet.service';

@Module({
  controllers: [KartFleetController],
  providers: [KartFleetService],
})
export class KartFleetModule {}
