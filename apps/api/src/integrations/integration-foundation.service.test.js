import test from "node:test";
import assert from "node:assert/strict";

import { IntegrationFoundationService } from "./integration-foundation.service.js";

const service = new IntegrationFoundationService();

test("separates two-way sync providers from one-way ICS publication", () => {
  const connections = service.getCalendarSyncFoundation();
  const twoWay = connections.filter((connection) => connection.direction === "two_way_sync");
  const oneWay = connections.filter((connection) => connection.direction === "one_way_publish");

  assert.equal(twoWay.length, 5);
  assert.equal(oneWay.length, 1);
  assert.equal(oneWay[0].provider, "one_way_ics_publication");
  assert.equal(oneWay[0].availabilityBlockingEnabled, false);
});

test("gates API credentials on premium-style plan and verification state", () => {
  const snapshot = service.evaluateHub({
    role: "owner",
    plan: "free",
    trialActive: false,
    dependencyReady: true,
    verificationState: "unverified"
  });

  assert.equal(snapshot.apiCredentials.enabled, false);
  assert(snapshot.apiCredentials.reasons.includes("premium or legacy developer tier is required for API credentials"));
  assert(snapshot.apiCredentials.reasons.includes("verified account required for API credential reset"));
});

test("keeps integrations as adapters over internal events", () => {
  const dispatch = service.buildAdapterDispatchPlan({
    eventName: "appointment.rescheduled",
    aggregateId: "apt_123",
    occurredAt: new Date().toISOString(),
    payload: {}
  });

  assert.equal(dispatch.mode, "internal-event-fanout");
  assert.deepEqual(dispatch.adapters, ["webhook", "analytics", "calendar_sync"]);
});

test("exposes explicit provider state model", () => {
  assert.deepEqual(service.listProviderStates(), [
    "never_connected",
    "connected",
    "disconnected",
    "action_required",
    "reauth_required",
    "error"
  ]);
});
