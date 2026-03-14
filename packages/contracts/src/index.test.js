import test from 'node:test';
import assert from 'node:assert/strict';
import { COMMUNICATION_CHANNELS, COMMUNICATION_PURPOSES } from './index.js';

test('contracts keep channel and purpose surfaces distinct', () => {
  assert.equal(COMMUNICATION_CHANNELS.includes('SMS_REMINDER'), true);
  assert.equal(COMMUNICATION_PURPOSES.includes('ORDER_RECEIPT'), true);
});
