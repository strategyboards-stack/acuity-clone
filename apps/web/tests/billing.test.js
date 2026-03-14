import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultHostBillingState, evaluateBillingGates, stateFromSearchParams } from '../lib/billing.js';
import { renderBillingShell } from '../lib/render.js';

test('contributor cannot access host billing shell', () => {
  const gate = evaluateBillingGates({ ...defaultHostBillingState, role: 'contributor' });
  assert.equal(gate.canAccessShell, false);
});

test('trial state blocks editable payment foundation', () => {
  const gate = evaluateBillingGates({
    ...defaultHostBillingState,
    dependencyState: 'ready',
    billingAddressComplete: true,
    plan: 'trial',
  });
  assert.equal(gate.canEditPaymentInformation, false);
  assert.equal(gate.requiresUpgrade, true);
});

test('paid + ready + complete address unlocks payment edit foundation', () => {
  const gate = evaluateBillingGates({
    ...defaultHostBillingState,
    plan: 'premium',
    dependencyState: 'ready',
    billingAddressComplete: true,
  });
  assert.equal(gate.canEditPaymentInformation, true);
});

test('query parser maps completeness and empty states', () => {
  const state = stateFromSearchParams(
    new URLSearchParams('plan=standard&address=complete&payment=present&dependency=ready&invoices=none&subscriptions=none'),
  );
  assert.equal(state.plan, 'standard');
  assert.equal(state.billingAddressComplete, true);
  assert.equal(state.paymentInfoPresent, true);
  assert.equal(state.hasInvoices, false);
});

test('payment information page renders incomplete-address warning', () => {
  const html = renderBillingShell('/account/billing/payment-information', defaultHostBillingState);
  assert.match(html, /Billing address incomplete/);
  assert.match(html, /No payment method on file/);
});
