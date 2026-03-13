import { describe, expect, it } from "vitest";
import { EntitlementMiddleware } from "../src/entitlements.js";

describe("EntitlementMiddleware", () => {
  it("permits owner for host.manageUsers", () => {
    const middleware = new EntitlementMiddleware();
    const req = {
      header: (name: string) => ({
        "x-role": "owner",
        "x-plan": "premium",
        "x-trial": "false",
        "x-payments-connected": "true",
        "x-email-verified": "true",
        "x-verification-complete": "true",
        "x-feature": "host.manageUsers"
      })[name]
    } as any;

    expect(() => middleware.use(req, {} as any, () => {})).not.toThrow();
  });
});
