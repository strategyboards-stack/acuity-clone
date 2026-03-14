import { MoneyFoundationService } from "./money-foundation.service.js";
import type { MoneyDependencyState } from "@acuity/contracts";

const service = new MoneyFoundationService();

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertDeepEqual(actual: unknown, expected: unknown, message: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)}`);
  }
}

const collectableDependency: MoneyDependencyState = {
  processor: { provider: "stripe", state: "connected" },
  verificationComplete: true,
  planSupportsMoneySurfaces: true,
};

const state = service.evaluateSurfaceState(collectableDependency);
assert(state.canCollectPayments === true, "collectable dependencies should allow collection");
assertDeepEqual(state.lockReasons, [], "collectable dependencies should not have lock reasons");
assert(state.emptyStateKey === "no_invoices", "connected state should return no_invoices empty state");

const disconnectedState = service.evaluateSurfaceState({
  ...collectableDependency,
  processor: { provider: null, state: "never_connected" },
});
assert(disconnectedState.canCollectPayments === false, "missing processor should block collection");
assert(disconnectedState.lockReasons.includes("processor_missing"), "missing processor should set reason");
assert(
  disconnectedState.emptyStateKey === "processor_not_connected",
  "missing processor should produce processor-not-connected empty state",
);

const downgradedPolicy = service.resolvePaymentPolicy(
  { mode: "full_payment_required" },
  {
    ...collectableDependency,
    processor: { provider: "stripe", state: "reauth_required" },
  },
);
assertDeepEqual(downgradedPolicy, { mode: "none" }, "reauth required should downgrade payment policy");

const invoice = service.createInvoiceDraft(
  {
    invoiceId: "inv_01",
    appointmentId: "apt_01",
    clientId: "client_01",
    amountCents: 10000,
    currency: "USD",
  },
  {
    ...collectableDependency,
    verificationComplete: false,
  },
);
assert(invoice.collectableNow === false, "verification required should block invoice collection");
assert(invoice.lockReasons.includes("verification_required"), "verification lock reason should be reported");

const depositFallback = service.resolvePaymentPolicy(
  { mode: "deposit_required", depositPercent: 0 },
  collectableDependency,
);
assertDeepEqual(depositFallback, { mode: "none" }, "invalid deposit should fall back to none");

console.log("MoneyFoundationService spec checks passed");
