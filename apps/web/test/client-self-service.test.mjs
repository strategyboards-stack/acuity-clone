import test from "node:test";
import assert from "node:assert/strict";
import { CLIENT_SELF_SERVICE_ROUTES, getConfirmationActions, isSelfServiceRoute } from "../dist/client-self-service.js";

test("confirmation action list includes only enabled actions", () => {
  const actions = getConfirmationActions({
    id: "apt_001",
    serviceName: "Consult",
    startsAtIso: "2026-01-01T10:00:00.000Z",
    canEdit: true,
    canReschedule: false,
    canCancel: true,
  });

  assert.deepEqual(actions, ["edit", "cancel"]);
});

test("self-service routes stay in shared namespaces", () => {
  assert.equal(isSelfServiceRoute("/client/login"), true);
  assert.equal(isSelfServiceRoute("/appointments/apt_001/actions"), true);
  assert.equal(isSelfServiceRoute("/admin/calendar"), false);
});

test("phase 4A foundation includes required route shells", () => {
  const routePaths = CLIENT_SELF_SERVICE_ROUTES.map((route) => route.pathname);
  assert.deepEqual(routePaths, [
    "/client/login",
    "/client/appointments",
    "/client/manage-codes",
    "/appointments/:appointmentId/actions",
  ]);
});
