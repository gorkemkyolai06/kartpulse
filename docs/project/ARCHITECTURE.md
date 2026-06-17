# KartPulse Mimari

## Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | NestJS 10, Prisma 5 |
| Database | PostgreSQL 16 |
| Auth | JWT (passport-jwt) |

## Backend Modülleri

- `health` — Sağlık kontrolü
- `auth` — Kayıt, giriş, JWT
- `kart-track` — Tesis profili
- `kart-fleet` — Kart filosu CRUD
- `race-sessions` — Yarış oturumları CRUD
- `kart-maintenance` — Kart bakım iş emirleri
- `track-maintenance` — Pist bakım planları
- `helmet-inventory` — Kask envanteri
- `rate-tiers` — Fiyat kademeleri
- `dashboard` — Operasyon istatistikleri

## Multi-Tenancy

Tüm kaynaklar `kartTrackId` ile scope edilir. JWT payload içinde `sub`, `email` ve `kartTrackId` taşınır.

## API Prefix

Tüm endpoint'ler `/api` prefix'i altında. CORS `FRONTEND_URL` env değişkeni ile yapılandırılır.

## Portlar

- Frontend: 3014
- Backend: 4014
- Postgres: 5454
