const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('apps/web/public/assets/booking-core.js', 'utf8')
  .replace(/export /g, '');
const context = { localStorage: { data: {}, getItem(k){return this.data[k] ?? null;}, setItem(k,v){this.data[k]=v;} } };
vm.createContext(context);
vm.runInContext(source, context);

const { createAppointment, canAccessAppointmentType, getAppointmentById } = context;

test('public booking creates appointment', () => {
  const apt = createAppointment({
    appointmentTypeSlug: 'initial-consultation', directLink: false, date: '2026-07-10', time: '10:30', firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '1234567', notes: '', recurringFrequency: 'none'
  }, context.localStorage);
  assert.ok(apt.id);
  assert.equal(getAppointmentById(apt.id, context.localStorage).client.email, 'a@b.com');
});

test('private booking blocked without direct link', () => {
  assert.equal(canAccessAppointmentType('vip-follow-up', false), false);
  assert.throws(() => createAppointment({
    appointmentTypeSlug: 'vip-follow-up', directLink: false, date: '2026-07-10', time: '10:30', firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '1234567', notes: '', recurringFrequency: 'none'
  }, context.localStorage));
});
