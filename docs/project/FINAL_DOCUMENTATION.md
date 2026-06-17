# KartPulse Final Documentation

## Proje Özeti

KartPulse, ABD'deki bağımsız go-kart pistleri (15-40 kart) için operasyon yönetim platformudur. Kart filosu envanteri, yarış oturum geliri, kart bakımı, pist bakımı, kask kiralama ve fiyat kademelerini tek panelde birleştirir.

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | NestJS, Prisma, PostgreSQL |
| Deployment | Railway (backend), Vercel (frontend) |

## Tasarım

Velocity Pit — karbon siyahı (#1A1A1A), yarış kırmızısı (#E10600), pit sarısı (#FFD100); Bebas Neue + DM Sans; sol sidebar navigasyon.

## Özellikler

1. Kart filosu envanteri ve durum yönetimi
2. Yarış oturum gelir takibi (nakit, kart, kask kiralama)
3. Kart bakım iş emirleri ve acil filtre
4. Pist bakım planı
5. Kask kiralama envanteri
6. Fiyat kademeleri (tek yarış, ısı paketi, doğum günü)
7. Operasyon dashboard (kullanım, gelir, trend)

## Demo

| Alan | Değer |
|------|-------|
| E-posta | demo@velocitykarttrack.com |
| Şifre | demo123456 |

## Portlar

| Servis | Port |
|--------|------|
| Frontend | 3014 |
| Backend | 4014 |
| PostgreSQL | 5454 |

## Mimari Kararlar

- Ayrı GitHub reposu: `gorkemkyolai06/kartpulse`
- JWT tabanlı kimlik doğrulama
- KartTrack scoped multi-tenant veri modeli
- MVP'de AI yok — bkz. `AI_SYSTEM.md`

## Deployment

Bkz. `docs/project/DEPLOYMENT.md`
