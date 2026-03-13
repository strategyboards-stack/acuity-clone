import { describe, expect, it } from "vitest";
import { isClientAuthEntry, requiresClientAuth } from "@/lib/auth/guards";

describe("auth guard route helpers", () => {
  it("requires auth for protected client routes", () => {
    expect(requiresClientAuth("/client")).toBe(true);
    expect(requiresClientAuth("/client/codes")).toBe(true);
  });

  it("does not require auth for login/signup/reset routes", () => {
    expect(requiresClientAuth("/client/login")).toBe(false);
    expect(requiresClientAuth("/client/signup")).toBe(false);
    expect(requiresClientAuth("/client/reset-password")).toBe(false);
  });

  it("recognizes auth entry paths", () => {
    expect(isClientAuthEntry("/client/login")).toBe(true);
    expect(isClientAuthEntry("/client/signup")).toBe(true);
    expect(isClientAuthEntry("/client/codes")).toBe(false);
  });
});
