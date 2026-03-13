import { describe, expect, it } from "vitest";
import {
  AppointmentAggregateSchema,
  ClientLoginInputSchema,
  ClientSignupInputSchema
} from "./index";

describe("contracts", () => {
  it("accepts valid signup payload", () => {
    const result = ClientSignupInputSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid login email", () => {
    const result = ClientLoginInputSchema.safeParse({
      email: "bad-email",
      password: "password123"
    });

    expect(result.success).toBe(false);
  });

  it("requires central appointment aggregate fields", () => {
    const result = AppointmentAggregateSchema.safeParse({
      id: crypto.randomUUID(),
      clientId: crypto.randomUUID(),
      appointmentTypeName: "Initial Consultation",
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 1800000).toISOString(),
      timezone: "America/New_York",
      status: "scheduled",
      locationLabel: "Virtual",
      canReschedule: true,
      canCancel: true
    });

    expect(result.success).toBe(true);
  });
});
