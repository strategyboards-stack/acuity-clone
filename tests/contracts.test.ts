import test from "node:test";
import assert from "node:assert/strict";
import { assertInvitation } from "../packages/contracts/src/index.js";

test("invitation-state foundation validates minimal shape", () => {
  const invitation = assertInvitation({
    id: "inv-1",
    email: "person@example.com",
    role: "contributor",
    status: "pending",
    verificationRequired: true,
    createdAtIso: "2026-01-01T00:00:00.000Z"
  });
  assert.equal(invitation.status, "pending");
});

test("invalid invitations throw", () => {
  assert.throws(() =>
    assertInvitation({
      id: "",
      email: "nope",
      role: "contributor",
      status: "pending",
      verificationRequired: true,
      createdAtIso: ""
    })
  );
});
