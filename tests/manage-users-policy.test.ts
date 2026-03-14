import test from "node:test";
import assert from "node:assert/strict";
import { evaluateManageUsersAccess } from "../apps/web/src/domain/manageUsersPolicy.js";

test("locks non-owner", () => {
  const result = evaluateManageUsersAccess({
    actorRole: "admin",
    plan: "standard",
    verificationState: "verified",
    dependencyReady: true
  });
  assert.equal(result.reason, "insufficient_role");
  assert.equal(result.canView, false);
});

test("verification-gates invite", () => {
  const result = evaluateManageUsersAccess({
    actorRole: "owner",
    plan: "premium",
    verificationState: "pending",
    dependencyReady: true
  });
  assert.equal(result.reason, "verification_required");
  assert.equal(result.canInvite, false);
});
