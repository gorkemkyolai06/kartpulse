# KartPulse Veritabanı

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| KartTrack | kart_tracks | Go-kart pisti bilgileri |
| User | users | Kullanıcı hesapları |
| KartFleet | kart_fleet | Kart filosu |
| RaceSession | race_sessions | Yarış oturum geliri |
| KartMaintenance | kart_maintenance | Kart bakım iş emirleri |
| TrackMaintenance | track_maintenance | Pist bakım planları |
| HelmetInventory | helmet_inventory | Kask kiralama envanteri |
| RateTier | rate_tiers | Fiyat kademeleri |

## Enum'lar

- **KartType:** junior, standard, pro, double
- **KartStatus:** available, racing, maintenance, retired
- **KartMaintenancePriority/Status:** low/medium/high/urgent, open/in_progress/completed/cancelled
- **TrackMaintenanceCategory:** surface_repair, barrier_check, timing_system, drainage, other
- **HelmetType:** youth, adult, pro, balaclava
- **RateCategory:** single_race, heat_package, birthday_party, league_night, group_event, other

## İndeksler

- `kart_fleet`: `(kartTrackId, status)`
- `race_sessions`: `(kartTrackId, sessionAt)`, `(kartTrackId, status)`
- `kart_maintenance`: `(kartTrackId, status)`, `(kartTrackId, priority)`
- `track_maintenance`: `(kartTrackId, scheduledAt)`
- `helmet_inventory`: `(kartTrackId, status)`, `(kartTrackId, helmetType)`
- `rate_tiers`: `(kartTrackId, rateCategory)`

## Demo Seed

| Alan | Değer |
|------|-------|
| Tesis | Velocity Kart Track |
| E-posta | demo@velocitykarttrack.com |
| Şifre | demo123456 |
