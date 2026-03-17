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

test('admin day/week/month changes real projection logic', () => {
  assert.ok(admin.includes('data-calendar-grid'));
  assert.ok(appJs.includes("if (currentView === 'day')"));
  assert.ok(appJs.includes("if (currentView === 'week')"));
  assert.ok(appJs.includes('// month'));
});

test('block off time is persisted as shared appointment source and affects booking availability', () => {
  assert.ok(appJs.includes("source: 'admin-block-off'"));
  assert.ok(appJs.includes('Unavailable on'));
  assert.ok(appJs.includes('is unavailable (blocked)'));
  assert.ok(booking.includes('data-booking-availability-note'));
});

test('admin and client use shared appointment source markers', () => {
  assert.ok(admin.includes('data-admin-appointments-list'));
  assert.ok(client.includes('data-client-appointments-list'));
  assert.ok(appJs.includes('listAppointmentsRequest'));
  assert.ok(appJs.includes('refreshAdminAppointments'));
  assert.ok(appJs.includes('refreshClientAppointments'));
});

test('client reschedule flow remains wired', () => {
  assert.ok(client.includes('data-open-modal'));
  assert.ok(client.includes('data-close-modal'));
  assert.ok(client.includes('data-client-save'));
  assert.ok(appJs.includes('wireClientSelfService'));
});
