# KartPulse API

Base URL: `http://localhost:4014/api`

## Auth

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| POST | `/auth/register` | No | 200 |
| POST | `/auth/login` | No | 200 |
| GET | `/auth/me` | Yes | 200 |

**Register body:** `email`, `password` (min 8), `firstName`, `lastName`, `kartTrackName`, opsiyonel `phone`, `city`, `state`

**Login response:**
```json
{
  "accessToken": "...",
  "user": { "id", "email", "firstName", "lastName", "role" },
  "kartTrack": { "id", "name" }
}
```

## Health

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/health` | No | 200 |

## Kart Track

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/kart-track` | Yes | 200 |
| PATCH | `/kart-track` | Yes | 200 |

## Kart Fleet

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/kart-fleet` | Yes | 200 |
| GET | `/kart-fleet/:id` | Yes | 200 |
| POST | `/kart-fleet` | Yes | 201 |
| PATCH | `/kart-fleet/:id` | Yes | 200 |
| DELETE | `/kart-fleet/:id` | Yes | 200 |

## Race Sessions

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/race-sessions` | Yes | 200 |
| GET | `/race-sessions/:id` | Yes | 200 |
| POST | `/race-sessions` | Yes | 201 |
| PATCH | `/race-sessions/:id` | Yes | 200 |
| DELETE | `/race-sessions/:id` | Yes | 200 |

## Kart Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/kart-maintenance` | Yes | 200 |
| GET | `/kart-maintenance/urgent` | Yes | 200 |
| GET | `/kart-maintenance/:id` | Yes | 200 |
| POST | `/kart-maintenance` | Yes | 201 |
| PATCH | `/kart-maintenance/:id` | Yes | 200 |
| DELETE | `/kart-maintenance/:id` | Yes | 200 |

## Track Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/track-maintenance` | Yes | 200 |
| GET | `/track-maintenance/:id` | Yes | 200 |
| POST | `/track-maintenance` | Yes | 201 |
| PATCH | `/track-maintenance/:id` | Yes | 200 |
| DELETE | `/track-maintenance/:id` | Yes | 200 |

## Helmet Inventory

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/helmet-inventory` | Yes | 200 |
| GET | `/helmet-inventory/available` | Yes | 200 |
| GET | `/helmet-inventory/:id` | Yes | 200 |
| POST | `/helmet-inventory` | Yes | 201 |
| PATCH | `/helmet-inventory/:id` | Yes | 200 |
| DELETE | `/helmet-inventory/:id` | Yes | 200 |

## Rate Tiers

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/rate-tiers` | Yes | 200 |
| GET | `/rate-tiers/:id` | Yes | 200 |
| POST | `/rate-tiers` | Yes | 201 |
| PATCH | `/rate-tiers/:id` | Yes | 200 |
| DELETE | `/rate-tiers/:id` | Yes | 200 |

## Dashboard

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/dashboard/stats` | Yes | 200 |
