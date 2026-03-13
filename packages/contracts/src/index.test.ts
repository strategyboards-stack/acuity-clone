import { describe, expect, it } from "vitest";
import { AvailabilityRuleSchema } from "./index.js";

describe("AvailabilityRuleSchema", () => {
  it("rejects invalid minute ranges", () => {
    const result = AvailabilityRuleSchema.safeParse({
      id: "6d11b6d6-8101-4fa8-9b45-4f3e86866998",
      tenantId: "e6fbec19-0608-40cb-ab2a-72cd4c44ad8e",
      calendarId: "0b7955ce-7778-420e-be0f-c7a2c63809ac",
      dayOfWeek: 1,
      startMinute: 600,
      endMinute: 600,
      timezone: "America/New_York",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    expect(result.success).toBe(false);
  });
});
