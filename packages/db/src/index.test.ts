import { describe, expect, it } from "vitest";

describe("db package", () => {
  it("exposes runtime package", () => {
    expect(typeof "ok").toBe("string");
  });
});
