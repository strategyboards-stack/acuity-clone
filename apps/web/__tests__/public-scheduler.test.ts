import { describe, expect, it } from "vitest";
import { getPublicCatalog, resolveService, generateSlots } from "@/lib/public-scheduler";

describe("public scheduler visibility filtering", () => {
  it("exposes only public, non-admin, non-internal services", () => {
    const catalog = getPublicCatalog();
    expect(catalog.map((service) => service.slug)).toEqual(["initial-consult", "follow-up"]);
  });

  it("allows direct-link private service resolution", () => {
    const service = resolveService({ service: "vip-private" });
    expect(service?.visibility).toBe("PRIVATE_DIRECT_LINK");
  });

  it("blocks admin-only and internal-only service links", () => {
    expect(resolveService({ service: "admin-addon" })).toBeNull();
    expect(resolveService({ service: "internal-only" })).toBeNull();
  });

  it("builds deterministic slot list", () => {
    const slots = generateSlots("2026-01-15", 60);
    expect(slots).toHaveLength(8);
    expect(slots.filter((slot) => slot.available)).toHaveLength(6);
  });
});
