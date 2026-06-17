import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(kartTrackId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      kartTrack,
      totalKarts,
      availableKarts,
      racingKarts,
      totalSessions,
      openKartMaintenance,
      urgentKartMaintenance,
      pendingTrackMaintenance,
      activeRateTiers,
      availableHelmets,
      rentedHelmets,
      revenueTotals,
      recentSessions,
      recentKartMaintenance,
      pitSections,
    ] = await Promise.all([
      this.prisma.kartTrack.findUnique({ where: { id: kartTrackId } }),
      this.prisma.kartFleet.count({ where: { kartTrackId } }),
      this.prisma.kartFleet.count({ where: { kartTrackId, status: 'available' } }),
      this.prisma.kartFleet.count({ where: { kartTrackId, status: 'racing' } }),
      this.prisma.raceSession.count({ where: { kartTrackId } }),
      this.prisma.kartMaintenance.count({
        where: { kartTrackId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.kartMaintenance.count({
        where: {
          kartTrackId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.trackMaintenance.count({
        where: {
          kartTrackId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.rateTier.count({
        where: { kartTrackId, status: 'active' },
      }),
      this.prisma.helmetInventory.count({
        where: { kartTrackId, status: 'available' },
      }),
      this.prisma.helmetInventory.count({
        where: { kartTrackId, status: 'rented' },
      }),
      this.prisma.raceSession.aggregate({
        where: { kartTrackId, sessionAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, helmetRentalRevenue: true },
      }),
      this.prisma.raceSession.findMany({
        where: { kartTrackId },
        include: {
          kartFleet: { select: { name: true, section: true, kartType: true } },
        },
        orderBy: { sessionAt: 'desc' },
        take: 5,
      }),
      this.prisma.kartMaintenance.findMany({
        where: { kartTrackId, status: { in: ['open', 'in_progress'] } },
        include: {
          kartFleet: { select: { name: true, section: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.kartFleet.groupBy({
        by: ['section'],
        where: { kartTrackId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = kartTrack?.totalKarts || totalKarts || 1;
    const fleetUtilizationRate =
      totalKarts > 0 ? Math.round((racingKarts / totalKarts) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.helmetRentalRevenue || 0);

    const dailyHelmetRentalRevenue = revenueTotals._sum.helmetRentalRevenue || 0;

    const monthlyTrend = await this.getMonthlyTrend(kartTrackId, sixMonthsAgo);

    return {
      totalKarts,
      availableKarts,
      racingKarts,
      totalCapacity,
      fleetUtilizationRate,
      totalSessions,
      openKartMaintenance,
      urgentKartMaintenance,
      pendingTrackMaintenance,
      activeRateTiers,
      availableHelmets,
      rentedHelmets,
      dailyRevenue,
      dailyHelmetRentalRevenue,
      recentSessions,
      recentKartMaintenance,
      pitSections: pitSections.map((s) => ({
        section: s.section,
        kartCount: s._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(kartTrackId: string, since: Date) {
    const sessions = await this.prisma.raceSession.findMany({
      where: { kartTrackId, sessionAt: { gte: since } },
      select: {
        sessionAt: true,
        cashAmount: true,
        cardAmount: true,
        helmetRentalRevenue: true,
        racers: true,
      },
    });

    const months: Record<string, { sessions: number; revenue: number; racers: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { sessions: 0, revenue: 0, racers: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.sessionAt.getFullYear()}-${String(session.sessionAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].sessions++;
        months[key].revenue +=
          session.cashAmount + session.cardAmount + session.helmetRentalRevenue;
        months[key].racers += session.racers;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
