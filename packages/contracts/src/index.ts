import { z } from "zod";

export const TenantIdSchema = z.string().uuid();
export const TimezoneSchema = z.string().min(1);

export const CalendarSchema = z.object({
  id: z.string().uuid(),
  tenantId: TenantIdSchema,
  name: z.string().min(1).max(160),
  timezone: TimezoneSchema,
  isPrimary: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const LocationSchema = z.object({
  id: z.string().uuid(),
  tenantId: TenantIdSchema,
  name: z.string().min(1).max(160),
  kind: z.enum(["IN_PERSON", "PHONE", "VIDEO", "CUSTOM"]),
  details: z.string().max(2000).nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const AvailabilityRuleSchema = z.object({
  id: z.string().uuid(),
  tenantId: TenantIdSchema,
  calendarId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startMinute: z.number().int().min(0).max(1439),
  endMinute: z.number().int().min(1).max(1440),
  timezone: TimezoneSchema,
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).refine((value) => value.endMinute > value.startMinute, {
  message: "endMinute must be greater than startMinute",
  path: ["endMinute"]
});

export const AvailabilityOverrideSchema = z.object({
  id: z.string().uuid(),
  tenantId: TenantIdSchema,
  calendarId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  isAvailable: z.boolean(),
  reason: z.string().max(500).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const ResourceSchema = z.object({
  id: z.string().uuid(),
  tenantId: TenantIdSchema,
  name: z.string().min(1).max(120),
  capacity: z.number().int().min(1).max(500),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const GlobalSchedulingLimitsSchema = z.object({
  id: z.string().uuid(),
  tenantId: TenantIdSchema,
  minimumNoticeMinutes: z.number().int().min(0).max(525600),
  maximumAdvanceDays: z.number().int().min(1).max(730),
  maxAppointmentsPerDay: z.number().int().min(1).max(10000),
  allowClientReschedule: z.boolean(),
  allowClientCancel: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Calendar = z.infer<typeof CalendarSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type AvailabilityRule = z.infer<typeof AvailabilityRuleSchema>;
export type AvailabilityOverride = z.infer<typeof AvailabilityOverrideSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type GlobalSchedulingLimits = z.infer<typeof GlobalSchedulingLimitsSchema>;
