import { describe, expect, it } from "vitest";
import { ModuleCard, ShellFrame } from "../src/index.js";

describe("ui exports", () => {
  it("exports shell components", () => {
    expect(typeof ShellFrame).toBe("function");
    expect(typeof ModuleCard).toBe("function");
  });
});
