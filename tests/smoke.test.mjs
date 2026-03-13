import test from 'node:test';
import assert from 'node:assert/strict';
import { publicSchedulerFoundation } from '../apps/web/src/public-scheduler-foundation.js';

test('phase 3A foundation exposes only Phase 3A scope', () => {
  assert.equal(publicSchedulerFoundation.phase, '3A');
  assert.ok(publicSchedulerFoundation.surfaces.includes('public-scheduler'));
  assert.ok(!publicSchedulerFoundation.includes.includes('phase-3b-enhancements'));
});
