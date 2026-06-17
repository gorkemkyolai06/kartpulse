# KartPulse — Ürün Gereksinim Belgesi (PRD)

**Durum:** MVP Tamamlandı  
**Oluşturma:** 2026-06-17  
**GitHub:** https://github.com/gorkemkyolai06/kartpulse

## Özet

KartPulse, ABD'deki bağımsız go-kart pistleri için kart filosu envanteri, yarış oturum geliri takibi, kart bakım yönetimi, pist bakım planlaması, kask kiralama envanteri ve fiyat kademesi yönetimi sunan B2B SaaS platformudur.

## Tasarım Yönü: Velocity Pit

Yarış pisti ve pit lane estetiği — karbon siyahı (#1A1A1A), yarış kırmızısı (#E10600), pit sarısı (#FFD100), damalı beyaz (#F5F5F5). Bebas Neue + DM Sans tipografi, sol sidebar navigasyon, 0px keskin köşeler ve sarı aksan şeritleri.

## Hedef Kitle

- ABD'deki 15-40 kartlı bağımsız go-kart pistleri (Texas, Florida, California)
- 1-2 lokasyonlu aile işletmeleri
- Kart bakımını ve pist bakımını Excel ile yöneten operatörler

## Problem

Kart filosu durumları, bakım iş emirleri, kask kiralama stokları ve günlük gelir kayıtları dağınık tablolarda tutuluyor. Pist bakım planları senkronize değil; güvenlik denetimleri kağıt formlarda kayboluyor.

## Çözüm

- Kart filosu envanteri ve durum takibi (müsait, pistte, bakımda, emekli)
- Kart bakım iş emirleri ve öncelik yönetimi
- Pist bakım planı ve tamamlanma kaydı
- Kask kiralama envanteri (çocuk, yetişkin, pro, balaklava)
- Yarış oturum geliri ve fiyat kademeleri

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@velocitykarttrack.com |
| Şifre | demo123456 |
| Tesis | Velocity Kart Track |

## Portlar

| Servis | Port |
|--------|------|
| Frontend | 3014 |
| Backend | 4014 |
| Postgres | 5454 |

## Modüller

1. **Kart Filosu** — Junior, standart, pro, çiftli kart envanteri
2. **Yarış Oturumları** — Nakit/kart gelir, yarışçı sayısı, kask kiralama
3. **Kart Bakımı** — Motor, fren, genel bakım iş emirleri
4. **Pist Bakımı** — Yüzey onarımı, bariyer, zamanlama sistemi
5. **Kask Envanteri** — Kask tipi, beden, kiralama fiyatı
6. **Fiyat Kademeleri** — Tek yarış, ısı paketi, doğum günü, lig gecesi
