import test from 'node:test';
import assert from 'node:assert/strict';

test('appointment domain object shape is stable', () => {
  const appointment = {
    id: 'apt_123',
    startsAtIso: '2026-03-14T10:00:00.000Z',
    serviceSlug: 'intro-call'
  };

  assert.equal(typeof appointment.id, 'string');
  assert.equal(typeof appointment.startsAtIso, 'string');
  assert.equal(typeof appointment.serviceSlug, 'string');
});
