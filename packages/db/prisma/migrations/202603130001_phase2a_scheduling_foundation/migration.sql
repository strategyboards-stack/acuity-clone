CREATE TYPE "LocationKind" AS ENUM ('IN_PERSON', 'PHONE', 'VIDEO', 'CUSTOM');

CREATE TABLE "Appointment" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Calendar" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "timezone" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Location" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "kind" "LocationKind" NOT NULL,
  "details" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "AvailabilityRule" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "calendarId" TEXT NOT NULL REFERENCES "Calendar"("id") ON DELETE CASCADE,
  "dayOfWeek" INTEGER NOT NULL,
  "startMinute" INTEGER NOT NULL,
  "endMinute" INTEGER NOT NULL,
  "timezone" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "AvailabilityOverride" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "calendarId" TEXT NOT NULL REFERENCES "Calendar"("id") ON DELETE CASCADE,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "isAvailable" BOOLEAN NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Resource" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "capacity" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "GlobalSchedulingLimit" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL UNIQUE,
  "minimumNoticeMinutes" INTEGER NOT NULL,
  "maximumAdvanceDays" INTEGER NOT NULL,
  "maxAppointmentsPerDay" INTEGER NOT NULL,
  "allowClientReschedule" BOOLEAN NOT NULL DEFAULT TRUE,
  "allowClientCancel" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Calendar_tenantId_idx" ON "Calendar"("tenantId");
CREATE INDEX "Location_tenantId_idx" ON "Location"("tenantId");
CREATE INDEX "AvailabilityRule_tenantId_calendarId_idx" ON "AvailabilityRule"("tenantId", "calendarId");
CREATE INDEX "AvailabilityOverride_tenantId_calendarId_idx" ON "AvailabilityOverride"("tenantId", "calendarId");
CREATE INDEX "Resource_tenantId_idx" ON "Resource"("tenantId");
