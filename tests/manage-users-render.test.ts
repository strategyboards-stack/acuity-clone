import test from "node:test";
import assert from "node:assert/strict";
import { getManageUsersViewModel } from "../apps/web/src/server/manageUsersGateway.js";
import { renderManageUsersHtml } from "../apps/web/src/renderManageUsers.js";

test("render shows verification gate text", () => {
  const html = renderManageUsersHtml(getManageUsersViewModel());
  assert.ok(html.includes("Verify your account to invite contributors."));
  assert.ok(html.includes('button disabled>Invite contributor (foundation)</button>'));
});
