import test from 'node:test';
import assert from 'node:assert/strict';
import { getPhaseOneBanner } from './index.js';

test('getPhaseOneBanner contains phase id', () => {
  assert.match(getPhaseOneBanner(), /phase-1/);
});
