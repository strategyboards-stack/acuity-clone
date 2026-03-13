import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCreateAppointmentCoupon, assertFeatureContext } from '../dist/index.js';

test('coupon validation accepts non-expiring payload', () => {
  assert.doesNotThrow(() =>
    assertCreateAppointmentCoupon({ accountId: 'a', code: 'SAVE10', discountPercent: 10 })
  );
});

test('feature context requires role and plan', () => {
  assert.doesNotThrow(() =>
    assertFeatureContext({ role: 'ADMIN', plan: 'STANDARD', inTrial: true, dependencyReady: true, verificationReady: true })
  );
});
