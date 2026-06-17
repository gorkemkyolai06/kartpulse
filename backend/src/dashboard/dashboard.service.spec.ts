import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    kartTrack: { findUnique: jest.fn() },
    kartFleet: { count: jest.fn(), groupBy: jest.fn() },
    raceSession: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    kartMaintenance: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    trackMaintenance: { count: jest.fn() },
    rateTier: { count: jest.fn() },
    helmetInventory: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return kart track dashboard stats', async () => {
    mockPrisma.kartTrack.findUnique.mockResolvedValue({ totalKarts: 24 });
    mockPrisma.kartFleet.count
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.raceSession.count.mockResolvedValue(42);
    mockPrisma.kartMaintenance.count.mockResolvedValue(3);
    mockPrisma.raceSession.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, helmetRentalRevenue: 95 },
    });
    mockPrisma.raceSession.findMany.mockResolvedValue([]);
    mockPrisma.kartMaintenance.findMany.mockResolvedValue([]);
    mockPrisma.trackMaintenance.count.mockResolvedValue(2);
    mockPrisma.rateTier.count.mockResolvedValue(3);
    mockPrisma.helmetInventory.count
      .mockResolvedValueOnce(18)
      .mockResolvedValueOnce(5);
    mockPrisma.kartFleet.groupBy.mockResolvedValue([
      { section: 'Pit Row A', _count: { id: 2 } },
      { section: 'Pit Row B', _count: { id: 2 } },
    ]);

    const stats = await service.getStats('kart-track-1');

    expect(stats).toHaveProperty('fleetUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyHelmetRentalRevenue', 95);
    expect(stats).toHaveProperty('pitSections');
    expect(stats).toHaveProperty('urgentKartMaintenance');
    expect(stats).toHaveProperty('pendingTrackMaintenance');
    expect(stats).toHaveProperty('activeRateTiers', 3);
    expect(stats).toHaveProperty('availableHelmets', 18);
    expect(stats).toHaveProperty('rentedHelmets', 5);
    expect(stats).toHaveProperty('availableKarts', 3);
    expect(stats).toHaveProperty('totalKarts', 6);
  });
});
