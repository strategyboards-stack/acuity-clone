import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

describe("web entitlement middleware", () => {
  it("redirects non-owner from manage users", () => {
    const request = new NextRequest("http://localhost/account/manage-users", {
      headers: { "x-role": "admin", "x-plan": "premium", "x-verification-complete": "true" }
    });

    const response = middleware(request);
    expect(response.status).toBe(307);
  });
});
