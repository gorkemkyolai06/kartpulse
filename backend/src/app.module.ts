import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { KartTrackModule } from './kart-track/kart-track.module';
import { KartFleetModule } from './kart-fleet/kart-fleet.module';
import { RaceSessionsModule } from './race-sessions/race-sessions.module';
import { KartMaintenanceModule } from './kart-maintenance/kart-maintenance.module';
import { TrackMaintenanceModule } from './track-maintenance/track-maintenance.module';
import { RateTiersModule } from './rate-tiers/rate-tiers.module';
import { HelmetInventoryModule } from './helmet-inventory/helmet-inventory.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    KartTrackModule,
    KartFleetModule,
    RaceSessionsModule,
    KartMaintenanceModule,
    TrackMaintenanceModule,
    RateTiersModule,
    HelmetInventoryModule,
    DashboardModule,
  ],
})
export class AppModule {}
