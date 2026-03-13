import { describe, expect, it } from "vitest";
import type { PublicSchedulerService } from "./index";

describe("contracts", () => {
  it("allows scheduler service shape", () => {
    const sample: PublicSchedulerService = {
      id: "svc",
      slug: "svc",
      name: "Service",
      durationMinutes: 30,
      visibility: "PUBLIC",
      adminOnly: false,
      internalUseForm: false,
      supportsMultiTime: true,
      supportsRecurring: true,
    };
    expect(sample.slug).toBe("svc");
  });
});
