import { describe, expect, it } from "vitest";
import {
  clientImportRowSchema,
  clientStateTransitionSchema,
  destructiveConfirmationSchema
} from "./index";

describe("contracts", () => {
  it("rejects invalid import rows missing contact path", () => {
    const result = clientImportRowSchema.safeParse({
      firstName: "Alex",
      lastName: "Rivera"
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid state transition payload", () => {
    const result = clientStateTransitionSchema.safeParse({
      clientId: "c_1",
      fromState: "active",
      toState: "banned",
      action: "ban-client",
      reason: "chargeback abuse",
      actorUserId: "u_admin",
      occurredAt: new Date().toISOString()
    });

    expect(result.success).toBe(true);
  });

  it("requires destructive confirmation for delete", () => {
    const result = destructiveConfirmationSchema.safeParse({
      clientId: "c_1",
      action: "delete-client",
      confirmed: false
    });

    expect(result.success).toBe(true);
    expect(result.data?.confirmed).toBe(false);
  });
});
