import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { evaluateIntegrationCapability } from '../dist/integrations/gating.js';

describe('evaluateIntegrationCapability', () => {
  it('locks viewer role across capabilities', () => {
    const decision = evaluateIntegrationCapability('webhooks', {
      role: 'viewer',
      plan: 'enterprise',
      trialActive: false,
      dependencyReady: true,
      verificationReady: true
    });

    assert.deepEqual(decision, {
      capability: 'webhooks',
      allowed: false,
      reason: 'insufficient-role'
    });
  });

  it('locks premium capability on starter plan', () => {
    const decision = evaluateIntegrationCapability('api-credentials', {
      role: 'owner',
      plan: 'starter',
      trialActive: false,
      dependencyReady: true,
      verificationReady: true
    });

    assert.equal(decision.reason, 'plan-lock');
    assert.equal(decision.allowed, false);
  });

  it('locks two-way sync during trial', () => {
    const decision = evaluateIntegrationCapability('calendar-sync-two-way', {
      role: 'owner',
      plan: 'premium',
      trialActive: true,
      dependencyReady: true,
      verificationReady: true
    });

    assert.equal(decision.reason, 'trial-lock');
  });

  it('enforces dependency-state lock', () => {
    const decision = evaluateIntegrationCapability('analytics-config', {
      role: 'admin',
      plan: 'premium',
      trialActive: false,
      dependencyReady: false,
      verificationReady: true
    });

    assert.equal(decision.reason, 'dependency-lock');
  });

  it('keeps webhooks verification-gated', () => {
    const decision = evaluateIntegrationCapability('webhooks', {
      role: 'owner',
      plan: 'premium',
      trialActive: false,
      dependencyReady: true,
      verificationReady: false
    });

    assert.equal(decision.reason, 'verification-lock');
  });

  it('allows one-way ICS independently when context is valid', () => {
    const decision = evaluateIntegrationCapability('calendar-sync-ics', {
      role: 'owner',
      plan: 'starter',
      trialActive: false,
      dependencyReady: true,
      verificationReady: true
    });

    assert.deepEqual(decision, {
      capability: 'calendar-sync-ics',
      allowed: true,
      reason: 'ok'
    });
  });
});
