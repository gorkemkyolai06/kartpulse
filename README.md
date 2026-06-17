# KartPulse

Go-kart track operations SaaS — kart fleet management, race sessions, maintenance tracking, helmet inventory, and pricing.

## Demo

- **Email:** demo@velocitykarttrack.com
- **Password:** demo123456

## Ports

| Service  | Port |
|----------|------|
| Frontend | 3014 |
| Backend  | 4014 |
| Postgres | 5454 |

## Quick Start

```bash
docker compose up --build
```

Or locally:

```bash
# Backend
cd backend && npm ci && npx prisma generate && npm run db:migrate && npm run db:seed && npm run start:dev

# Frontend
cd frontend && npm ci && npm run dev
```

## Design

**Velocity Pit** — carbon black `#1A1A1A`, racing red `#E10600`, pit yellow `#FFD100`, checkered white `#F5F5F5`. Bebas Neue + DM Sans. Left sidebar navigation with sharp corners and yellow accent stripes.

## Domain

| Entity | Description |
|--------|-------------|
| KartTrack | Go-kart facility |
| KartFleet | Individual karts in fleet |
| RaceSession | Race session revenue |
| KartMaintenance | Kart maintenance work orders |
| TrackMaintenance | Track surface/maintenance schedules |
| HelmetInventory | Helmet rental inventory |
| RateTier | Session pricing |
