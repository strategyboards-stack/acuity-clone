import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAppointments } from '../src/index.js';

const appointments = [
  { id:'1', serviceName:'Consult', clientName:'Jamie', clientEmail:'j@e.com', staffMemberName:'Dr. A', timezone:'UTC', startsAt:'2026-03-14T13:00:00.000Z', endsAt:'2026-03-14T13:30:00.000Z', status:'scheduled' },
  { id:'2', serviceName:'Follow Up', clientName:'Morgan', clientEmail:'m@e.com', staffMemberName:'Dr. B', timezone:'UTC', startsAt:'2026-03-15T13:00:00.000Z', endsAt:'2026-03-15T13:30:00.000Z', status:'checked_in' },
  { id:'3', serviceName:'Timezone Edge', clientName:'Avery', clientEmail:'a@e.com', staffMemberName:'Dr. B', timezone:'UTC', startsAt:'2026-03-14T23:00:00-02:00', endsAt:'2026-03-15T00:00:00-02:00', status:'scheduled' }
];

test('filters by search and staff', () => {
  const out = filterAppointments(appointments, { from:'2026-03-14T00:00:00.000Z', to:'2026-03-20T00:00:00.000Z', search:'Morgan', staff:'Dr. B', status:'all' });
  assert.equal(out.length, 1);
  assert.equal(out[0].id, '2');
});

test('uses parsed datetimes for timezone-safe range filtering', () => {
  const out = filterAppointments(appointments, { from:'2026-03-14T00:00:00.000Z', to:'2026-03-14T23:59:59.999Z', staff:'all', status:'all' });
  assert.deepEqual(out.map((apt) => apt.id), ['1']);
});
