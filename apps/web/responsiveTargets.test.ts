import { describe, expect, it } from "vitest";
import { MOBILE_TARGETS } from "./responsiveTargets";

describe("mobile viewport targets", () => {
  it("includes all required responsive targets", () => {
    expect(MOBILE_TARGETS).toEqual([
      "390x844",
      "360x800",
      "375x667",
      "412x915",
      "430x932",
      "768x1024"
    ]);
  });
});
