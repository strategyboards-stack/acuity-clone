import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAppointments } from '../src/index.js';

const appointments = [
  { id:'1', serviceName:'Consult', clientName:'Jamie', clientEmail:'j@e.com', staffMemberName:'Dr. A', timezone:'UTC', startsAt:'2026-03-14T13:00:00.000Z', endsAt:'2026-03-14T13:30:00.000Z', status:'scheduled' },
  { id:'2', serviceName:'Follow Up', clientName:'Morgan', clientEmail:'m@e.com', staffMemberName:'Dr. B', timezone:'UTC', startsAt:'2026-03-15T13:00:00.000Z', endsAt:'2026-03-15T13:30:00.000Z', status:'checked_in' }
];

test('filters by search and staff', () => {
  const out = filterAppointments(appointments, { from:'2026-03-14T00:00:00.000Z', to:'2026-03-20T00:00:00.000Z', search:'Morgan', staff:'Dr. B', status:'all' });
  assert.equal(out.length, 1);
  assert.equal(out[0].id, '2');
});
