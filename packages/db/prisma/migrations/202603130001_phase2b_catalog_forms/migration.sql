-- Phase 2B Catalog and Forms configuration tables
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'CONTRIBUTOR');
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'STANDARD', 'PREMIUM');

CREATE TABLE "Account" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "plan" "PlanTier" NOT NULL DEFAULT 'FREE',
  "inTrial" BOOLEAN NOT NULL DEFAULT false,
  "dependencyReady" BOOLEAN NOT NULL DEFAULT false,
  "verificationReady" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "AccountMember" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL REFERENCES "Account"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  CONSTRAINT "account_member_unique" UNIQUE ("accountId", "userId")
);

CREATE TABLE "AppointmentType" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL REFERENCES "Account"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "privateType" BOOLEAN NOT NULL DEFAULT false,
  "directBookingLink" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "AddOn" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL REFERENCES "Account"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "adminOnly" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "AppointmentCoupon" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL REFERENCES "Account"("id") ON DELETE CASCADE,
  "code" TEXT NOT NULL,
  "discountPercent" NUMERIC(5,2) NOT NULL,
  "expiresAt" TIMESTAMP,
  "active" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "appointment_coupon_unique" UNIQUE ("accountId", "code")
);

CREATE TABLE "IntakeForm" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL REFERENCES "Account"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "internalUse" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "IntakeQuestion" (
  "id" TEXT PRIMARY KEY,
  "formId" TEXT NOT NULL REFERENCES "IntakeForm"("id") ON DELETE CASCADE,
  "prompt" TEXT NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT false,
  "position" INTEGER NOT NULL
);
