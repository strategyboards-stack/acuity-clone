import { describe, expect, it } from "vitest";
import { assertTestEnv } from "../src/test-env.js";

describe("assertTestEnv", () => {
  it("hydrates NODE_ENV if missing", () => {
    delete process.env.NODE_ENV;
    assertTestEnv();
    expect(process.env.NODE_ENV).toBe("test");
  });
});
