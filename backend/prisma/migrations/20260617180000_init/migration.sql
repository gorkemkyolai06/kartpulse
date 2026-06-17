-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'front_desk');

-- CreateEnum
CREATE TYPE "KartType" AS ENUM ('junior', 'standard', 'pro', 'double');

-- CreateEnum
CREATE TYPE "KartStatus" AS ENUM ('available', 'racing', 'maintenance', 'retired');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "KartMaintenancePriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "KartMaintenanceStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TrackMaintenanceCategory" AS ENUM ('surface_repair', 'barrier_check', 'timing_system', 'drainage', 'other');

-- CreateEnum
CREATE TYPE "TrackMaintenanceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "RateCategory" AS ENUM ('single_race', 'heat_package', 'birthday_party', 'league_night', 'group_event', 'other');

-- CreateEnum
CREATE TYPE "RateStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "HelmetType" AS ENUM ('youth', 'adult', 'pro', 'balaclava');

-- CreateEnum
CREATE TYPE "HelmetStatus" AS ENUM ('available', 'rented', 'maintenance', 'retired');

-- CreateTable
CREATE TABLE "kart_tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_karts" INTEGER NOT NULL DEFAULT 24,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kart_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "kart_track_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kart_fleet" (
    "id" TEXT NOT NULL,
    "kart_track_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "kart_type" "KartType" NOT NULL DEFAULT 'standard',
    "engine_spec" TEXT,
    "status" "KartStatus" NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kart_fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_sessions" (
    "id" TEXT NOT NULL,
    "kart_track_id" TEXT NOT NULL,
    "kart_fleet_id" TEXT NOT NULL,
    "session_at" TIMESTAMP(3) NOT NULL,
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "racers" INTEGER NOT NULL DEFAULT 0,
    "helmet_rental_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "race_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kart_maintenance" (
    "id" TEXT NOT NULL,
    "kart_track_id" TEXT NOT NULL,
    "kart_fleet_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "KartMaintenancePriority" NOT NULL DEFAULT 'medium',
    "status" "KartMaintenanceStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kart_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_maintenance" (
    "id" TEXT NOT NULL,
    "kart_track_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "TrackMaintenanceCategory" NOT NULL DEFAULT 'other',
    "section" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "TrackMaintenanceStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "track_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_tiers" (
    "id" TEXT NOT NULL,
    "kart_track_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rate_category" "RateCategory" NOT NULL DEFAULT 'single_race',
    "status" "RateStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helmet_inventory" (
    "id" TEXT NOT NULL,
    "kart_track_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "helmet_type" "HelmetType" NOT NULL,
    "size" TEXT,
    "status" "HelmetStatus" NOT NULL DEFAULT 'available',
    "rental_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "helmet_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kart_fleet_kart_track_id_name_key" ON "kart_fleet"("kart_track_id", "name");

-- CreateIndex
CREATE INDEX "kart_fleet_kart_track_id_status_idx" ON "kart_fleet"("kart_track_id", "status");

-- CreateIndex
CREATE INDEX "race_sessions_kart_track_id_session_at_idx" ON "race_sessions"("kart_track_id", "session_at");

-- CreateIndex
CREATE INDEX "race_sessions_kart_track_id_status_idx" ON "race_sessions"("kart_track_id", "status");

-- CreateIndex
CREATE INDEX "kart_maintenance_kart_track_id_status_idx" ON "kart_maintenance"("kart_track_id", "status");

-- CreateIndex
CREATE INDEX "kart_maintenance_kart_track_id_priority_idx" ON "kart_maintenance"("kart_track_id", "priority");

-- CreateIndex
CREATE INDEX "track_maintenance_kart_track_id_scheduled_at_idx" ON "track_maintenance"("kart_track_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "rate_tiers_kart_track_id_rate_category_idx" ON "rate_tiers"("kart_track_id", "rate_category");

-- CreateIndex
CREATE INDEX "helmet_inventory_kart_track_id_helmet_type_idx" ON "helmet_inventory"("kart_track_id", "helmet_type");

-- CreateIndex
CREATE INDEX "helmet_inventory_kart_track_id_status_idx" ON "helmet_inventory"("kart_track_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_kart_track_id_fkey" FOREIGN KEY ("kart_track_id") REFERENCES "kart_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kart_fleet" ADD CONSTRAINT "kart_fleet_kart_track_id_fkey" FOREIGN KEY ("kart_track_id") REFERENCES "kart_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_sessions" ADD CONSTRAINT "race_sessions_kart_track_id_fkey" FOREIGN KEY ("kart_track_id") REFERENCES "kart_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_sessions" ADD CONSTRAINT "race_sessions_kart_fleet_id_fkey" FOREIGN KEY ("kart_fleet_id") REFERENCES "kart_fleet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kart_maintenance" ADD CONSTRAINT "kart_maintenance_kart_track_id_fkey" FOREIGN KEY ("kart_track_id") REFERENCES "kart_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kart_maintenance" ADD CONSTRAINT "kart_maintenance_kart_fleet_id_fkey" FOREIGN KEY ("kart_fleet_id") REFERENCES "kart_fleet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_maintenance" ADD CONSTRAINT "track_maintenance_kart_track_id_fkey" FOREIGN KEY ("kart_track_id") REFERENCES "kart_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_tiers" ADD CONSTRAINT "rate_tiers_kart_track_id_fkey" FOREIGN KEY ("kart_track_id") REFERENCES "kart_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "helmet_inventory" ADD CONSTRAINT "helmet_inventory_kart_track_id_fkey" FOREIGN KEY ("kart_track_id") REFERENCES "kart_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
