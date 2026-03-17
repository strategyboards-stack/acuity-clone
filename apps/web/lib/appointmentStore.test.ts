import { describe, expect, it } from "vitest";
import { canBookSlot, DEFAULT_STATE, toggleBlockedSlot } from "./appointmentStore";

describe("appointment store", () => {
  it("prevents booking blocked slots", () => {
    expect(canBookSlot(DEFAULT_STATE, "2026-03-18", "15:00")).toBe(false);
  });

  it("allows booking free slots", () => {
    expect(canBookSlot(DEFAULT_STATE, "2026-03-19", "09:00")).toBe(true);
  });

  it("toggles block-off slots", () => {
    const next = toggleBlockedSlot(DEFAULT_STATE, "2026-03-19", "11:30");
    expect(next.blockedSlots).toContain("2026-03-19|11:30");
  });
});
