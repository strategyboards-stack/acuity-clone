import test from 'node:test';
import assert from 'node:assert/strict';
import { PHASE_ONE_STATUS } from './index.js';

test('PHASE_ONE_STATUS uses phase-1 identifier', () => {
  assert.equal(PHASE_ONE_STATUS.id, 'phase-1');
});
