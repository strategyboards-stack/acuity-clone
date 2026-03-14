import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOrdersOperationalView,
  buildSubscribersOperationalView,
  deriveAdminSurfaceState,
  evaluateProductSellability,
  validateCodeSystemSeparation,
} from "../dist/money/src/index.js";

test("locks product sellability when processor is not connected even on paid plans", () => {
  const result = evaluateProductSellability("package", {
    role: "owner",
    plan: "premium",
    trialState: "paid",
    verificationState: "verified",
    processor: {
      provider: "none",
      state: "never_connected",
    },
  });

  assert.equal(result.allowed, false);
  assert.ok(result.reasons.includes("payment_processor_required"));
});

test("keeps appointment coupons separate from package/gift/subscription code systems", () => {
  const result = validateCodeSystemSeparation({
    packages: [{ id: "pkg_1", kind: "package", name: "Starter Package", code: "SAVE10", active: true }],
    giftCertificates: [],
    subscriptions: [],
    appointmentCoupons: [{ id: "c_1", code: "SAVE10", discountLabel: "10 off", appliesToAppointmentTypes: ["type_1"] }],
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.collisions, ["save10"]);
});

test("returns locked admin state before empty state when gating fails", () => {
  const state = deriveAdminSurfaceState(
    "subscriptions",
    {
      role: "owner",
      plan: "starter",
      trialState: "trial",
      verificationState: "verified",
      processor: {
        provider: "stripe",
        state: "connected",
      },
    },
    [],
  );

  assert.equal(state.mode, "locked");
  assert.ok(state.lockReasons?.includes("plan_locked"));
});

test("builds orders and subscribers operational views tied to appointment linkage", () => {
  const orders = buildOrdersOperationalView([
    {
      id: "ord_1",
      productId: "sub_1",
      productKind: "subscription",
      clientId: "cli_1",
      appointmentId: "apt_1",
      purchasedAtIso: new Date().toISOString(),
      status: "completed",
    },
    {
      id: "ord_2",
      productId: "pkg_1",
      productKind: "package",
      clientId: "cli_2",
      purchasedAtIso: new Date().toISOString(),
      status: "refunded",
    },
  ]);

  const subscribers = buildSubscribersOperationalView([
    {
      id: "subr_1",
      subscriptionProductId: "sub_1",
      clientId: "cli_1",
      appointmentId: "apt_1",
      status: "active",
    },
    {
      id: "subr_2",
      subscriptionProductId: "sub_2",
      clientId: "cli_2",
      status: "paused",
    },
  ]);

  assert.equal(orders.totalOrders, 2);
  assert.equal(orders.appointmentLinkedOrders, 1);
  assert.equal(subscribers.totalSubscribers, 2);
  assert.equal(subscribers.appointmentLinkedSubscribers, 1);
});
