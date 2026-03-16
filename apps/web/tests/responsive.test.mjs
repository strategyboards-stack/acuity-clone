import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('apps/web/public/assets/styles.css', 'utf8');
const admin = fs.readFileSync('apps/web/public/admin/calendar/index.html', 'utf8');
const booking = fs.readFileSync('apps/web/public/booking/demo/index.html', 'utf8');
const client = fs.readFileSync('apps/web/public/client/index.html', 'utf8');
const appJs = fs.readFileSync('apps/web/public/assets/app.js', 'utf8');

test('includes mobile viewport hardening breakpoints', () => {
  for (const bp of ['820px', '430px']) assert.ok(css.includes(bp));
});

test('admin calendar action buttons are wired', () => {
  for (const action of ['data-nav=\'prev\'', 'data-nav=\'today\'', 'data-nav=\'next\'', 'data-save-detail', 'data-open-create', 'data-open-block']) {
    assert.ok(admin.includes(action));
  }
  assert.ok(appJs.includes("openCreateModal('block')"));
  assert.ok(appJs.includes('saveDetail?.addEventListener'));
});

test('admin/client use shared appointment source markers', () => {
  assert.ok(admin.includes('data-admin-appointments-list'));
  assert.ok(client.includes('data-client-appointments-list'));
  assert.ok(appJs.includes('listAppointmentsRequest'));
  assert.ok(appJs.includes('refreshAdminAppointments'));
  assert.ok(appJs.includes('refreshClientAppointments'));
});

test('booking continue advances flow and confirm creates appointment through API', () => {
  assert.ok(booking.includes("data-booking-step='1'"));
  assert.ok(booking.includes("data-booking-step='2'"));
  assert.ok(booking.includes('data-booking-date'));
  assert.ok(appJs.includes('wireBookingDemo'));
  assert.ok(appJs.includes('createAppointmentRequest'));
  assert.ok(appJs.includes("step1?.classList.add('hidden')"));
});

test('client reschedule flow supports open, close, save', () => {
  assert.ok(client.includes('data-open-modal'));
  assert.ok(client.includes('data-close-modal'));
  assert.ok(client.includes('data-client-save'));
  assert.ok(appJs.includes('wireClientSelfService'));
});
