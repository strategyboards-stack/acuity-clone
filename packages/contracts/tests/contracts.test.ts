import { describe, expect, it } from "vitest";
import { entitlementContextSchema } from "../src/index.js";

describe("entitlement context contract", () => {
  it("accepts valid context", () => {
    const parsed = entitlementContextSchema.parse({
      role: "owner",
      plan: "standard",
      trialActive: true,
      dependencies: { paymentsConnected: false, emailVerified: true },
      verificationComplete: true
    });

    expect(parsed.role).toBe("owner");
  });
});
