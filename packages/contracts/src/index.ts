import { z } from "zod";

export const ClientSignupInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128)
});

export const ClientLoginInputSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128)
});

export const ClientResetPasswordInputSchema = z.object({
  email: z.string().trim().email()
});

export const ClientCodeSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(3).max(40),
  type: z.enum(["coupon", "gift_certificate", "package"]),
  status: z.enum(["active", "redeemed", "expired"]),
  expiresAt: z.string().datetime().nullable()
});

export const AppointmentStatusSchema = z.enum([
  "scheduled",
  "rescheduled",
  "cancelled",
  "completed"
]);

export const AppointmentAggregateSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  appointmentTypeName: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  timezone: z.string().min(1),
  status: AppointmentStatusSchema,
  locationLabel: z.string().min(1),
  canReschedule: z.boolean(),
  canCancel: z.boolean()
});

export type ClientSignupInput = z.infer<typeof ClientSignupInputSchema>;
export type ClientLoginInput = z.infer<typeof ClientLoginInputSchema>;
export type ClientResetPasswordInput = z.infer<typeof ClientResetPasswordInputSchema>;
export type ClientCode = z.infer<typeof ClientCodeSchema>;
export type AppointmentAggregate = z.infer<typeof AppointmentAggregateSchema>;
