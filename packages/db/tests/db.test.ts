import { describe, expect, it } from "vitest";
import { prisma } from "../src/index.js";

describe("db client", () => {
  it("exposes prisma instance", () => {
    expect(prisma).toBeDefined();
  });
});
