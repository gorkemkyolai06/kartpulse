# KartPulse QA Raporu

**Tarih:** 2026-06-17  
**Repo:** https://github.com/gorkemkyolai06/kartpulse

## Yerel Doğrulama

| Test | Durum |
|------|-------|
| Backend build | ✅ Geçti |
| Backend unit tests (dashboard) | ✅ Geçti |
| Frontend production build | ✅ Geçti (14 sayfa) |
| Integration tests (18 senaryo) | ⏳ CI'da çalışacak |

## Entegrasyon Test Senaryoları

1. Health Check (200)
2. Login (200)
3. Dashboard Stats (200)
4. List Kart Fleet (200)
5. List Race Sessions (200)
6. List Kart Maintenance (200)
7. List Track Maintenance (200)
8. List Helmet Inventory (200)
9. List Rate Tiers (200)
10. Kart Track Profile (200)
11. Urgent Kart Maintenance (200)
12. Available Helmets (200)
13. Create Kart (201)
14. Update Kart (200)
15. Delete Kart (200)
16. Create Helmet (201)
17. Update Helmet (200)
18. Delete Helmet (200)
19. Unauthorized Access (401)

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@velocitykarttrack.com |
| Şifre | demo123456 |

## Production Doğrulama

| Test | Durum |
|------|-------|
| Railway health endpoint | ⏳ Deploy bekliyor |
| Vercel frontend | ⏳ Deploy bekliyor |
| Demo login (production) | ⏳ Deploy bekliyor |
