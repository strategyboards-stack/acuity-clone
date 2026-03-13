import { describe, expect, it } from "vitest";
import { entitlementQueue } from "../src/main.js";

describe("worker shell", () => {
  it("creates queue", () => {
    expect(entitlementQueue.name).toBe("entitlement-events");
  });
});
