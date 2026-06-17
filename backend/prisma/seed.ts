import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const KART_TRACK_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.kartTrack.upsert({
    where: { id: KART_TRACK_ID },
    update: {},
    create: {
      id: KART_TRACK_ID,
      name: 'Velocity Kart Track',
      phone: '+18475550914',
      address: '880 Speedway Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      totalKarts: 24,
      timezone: 'America/Chicago',
      users: {
        create: {
          email: 'demo@velocitykarttrack.com',
          passwordHash,
          firstName: 'Marcus',
          lastName: 'Velocity',
          role: 'owner',
        },
      },
    },
  });

  const kartFleetData = [
    { id: '00000000-0000-0000-0000-000000000101', name: 'Kart #01', section: 'Pit Row A', kartType: 'junior' as const, engineSpec: '6.5 HP', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000102', name: 'Kart #02', section: 'Pit Row A', kartType: 'junior' as const, engineSpec: '6.5 HP', status: 'racing' as const },
    { id: '00000000-0000-0000-0000-000000000103', name: 'Kart #07', section: 'Pit Row B', kartType: 'standard' as const, engineSpec: '9 HP', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000104', name: 'Kart #12', section: 'Pit Row B', kartType: 'pro' as const, engineSpec: '13 HP', status: 'racing' as const },
    { id: '00000000-0000-0000-0000-000000000105', name: 'Kart #18', section: 'Pro Lane', kartType: 'pro' as const, engineSpec: '13 HP', status: 'maintenance' as const },
    { id: '00000000-0000-0000-0000-000000000106', name: 'Kart #22', section: 'Family Zone', kartType: 'double' as const, engineSpec: '9 HP Twin', status: 'available' as const },
  ];

  const kartFleet = [];
  for (const kart of kartFleetData) {
    const fleet = await prisma.kartFleet.upsert({
      where: { id: kart.id },
      update: {},
      create: { ...kart, kartTrackId: KART_TRACK_ID },
    });
    kartFleet.push(fleet);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.raceSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      kartTrackId: KART_TRACK_ID,
      kartFleetId: kartFleet[2].id,
      sessionAt: yesterday,
      cashAmount: 85.0,
      cardAmount: 1240.0,
      racers: 42,
      helmetRentalRevenue: 126.0,
      status: 'verified',
    },
  });

  await prisma.raceSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      kartTrackId: KART_TRACK_ID,
      kartFleetId: kartFleet[3].id,
      sessionAt: yesterday,
      cashAmount: 0,
      cardAmount: 680.0,
      racers: 18,
      helmetRentalRevenue: 54.0,
      status: 'verified',
    },
  });

  const reportedAt = new Date();
  reportedAt.setDate(reportedAt.getDate() - 2);

  await prisma.kartMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      kartTrackId: KART_TRACK_ID,
      kartFleetId: kartFleet[4].id,
      title: 'Motor yağı değişimi — Kart #18',
      description: 'Pro serisi 13 HP motor yağı ve filtre değişimi',
      reportedAt,
      priority: 'high',
      status: 'in_progress',
    },
  });

  await prisma.kartMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      kartTrackId: KART_TRACK_ID,
      kartFleetId: kartFleet[1].id,
      title: 'Fren balata kontrolü — Kart #02',
      description: 'Junior filo fren aşınma kontrolü',
      reportedAt,
      priority: 'urgent',
      status: 'open',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  await prisma.trackMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      kartTrackId: KART_TRACK_ID,
      title: 'Pist yüzeyi onarımı — Turn 3',
      description: 'Turn 3 girişinde asfalt çatlak tamiri',
      category: 'surface_repair',
      section: 'Turn 3',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.trackMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      kartTrackId: KART_TRACK_ID,
      title: 'Zamanlama sistemi kalibrasyonu',
      category: 'timing_system',
      section: 'Start/Finish',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      kartTrackId: KART_TRACK_ID,
      title: 'Tek Yarış',
      rateCategory: 'single_race',
      basePrice: 28.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      kartTrackId: KART_TRACK_ID,
      title: '3 Isı Paketi',
      rateCategory: 'heat_package',
      basePrice: 72.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000503' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000503',
      kartTrackId: KART_TRACK_ID,
      title: 'Doğum Günü Paketi',
      rateCategory: 'birthday_party',
      basePrice: 399.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  const helmetData = [
    { id: '00000000-0000-0000-0000-000000000601', name: 'Youth Helmet S', helmetType: 'youth' as const, size: 'S', status: 'available' as const, rentalPrice: 3.0 },
    { id: '00000000-0000-0000-0000-000000000602', name: 'Adult Helmet M', helmetType: 'adult' as const, size: 'M', status: 'rented' as const, rentalPrice: 4.0 },
    { id: '00000000-0000-0000-0000-000000000603', name: 'Pro Helmet L', helmetType: 'pro' as const, size: 'L', status: 'available' as const, rentalPrice: 5.0 },
    { id: '00000000-0000-0000-0000-000000000604', name: 'Balaclava — Black', helmetType: 'balaclava' as const, size: null, status: 'available' as const, rentalPrice: 2.0 },
    { id: '00000000-0000-0000-0000-000000000605', name: 'Adult Helmet XL', helmetType: 'adult' as const, size: 'XL', status: 'maintenance' as const, rentalPrice: 4.0 },
  ];

  for (const helmet of helmetData) {
    await prisma.helmetInventory.upsert({
      where: { id: helmet.id },
      update: {},
      create: { ...helmet, kartTrackId: KART_TRACK_ID },
    });
  }

  console.log('KartPulse seed completed — demo@velocitykarttrack.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
