# KartPulse Tasarım Sistemi

## Velocity Pit

Go-kart pisti operasyonları için yarış odaklı, yüksek kontrastlı arayüz.

### Renk Paleti

| Token | Hex | Kullanım |
|-------|-----|----------|
| Carbon | #1A1A1A | Arka plan (dark), primary |
| Racing Red | #E10600 | Accent, CTA, vurgu |
| Pit Yellow | #FFD100 | Sidebar accent, primary (dark) |
| Checkered White | #F5F5F5 | Arka plan (light), metin (dark) |

### Tipografi

- **Display:** Bebas Neue — başlıklar, logo, büyük sayılar
- **Body:** DM Sans — form, tablo, açıklama metinleri
- **Mono:** Sistem monospace — fiyat, istatistik

### Layout

- **Sol sidebar** — sabit 256px genişlik
- **0px border-radius** — keskin köşeler (pit lane estetiği)
- **Sarı sol kenarlık** — aktif nav item, kart vurgusu
- **pit-card** — sol 4px accent border

### Bileşenler

- `pit-card` — içerik kartları
- `pit-btn` — birincil aksiyon butonları
- `kart-pill-*` — kart durum etiketleri

### Tema

`kartpulse_theme` localStorage key — carbon arka plan, pit sarısı vurgu, racing red accent.

### UI Dili

Tüm kullanıcı arayüzü metinleri **Türkçe**. Kod tanımlayıcıları **İngilizce**.
