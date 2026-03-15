import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveCalendarState } from '../src/admin-calendar.js';

test('selected-state and search/filter foundation', () => {
  const state = deriveCalendarState({ search: 'Morgan', activeId: 'apt_102' });
  assert.equal(state.filtered.length, 1);
  assert.equal(state.active.clientName, 'Morgan Lee');
});
