import { Module } from '@nestjs/common';
import { KartTrackController } from './kart-track.controller';
import { KartTrackService } from './kart-track.service';

@Module({
  controllers: [KartTrackController],
  providers: [KartTrackService],
})
export class KartTrackModule {}
