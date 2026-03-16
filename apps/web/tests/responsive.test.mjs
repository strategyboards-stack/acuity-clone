import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('apps/web/public/assets/styles.css', 'utf8');
const admin = fs.readFileSync('apps/web/public/admin/calendar/index.html', 'utf8');
const client = fs.readFileSync('apps/web/public/client/index.html', 'utf8');
const adminJs = fs.readFileSync('apps/web/public/assets/app.js', 'utf8');

test('includes mobile viewport hardening breakpoints', () => {
  for (const bp of ['820px', '430px']) {
    assert.ok(css.includes(bp));
  }
});

test('admin calendar has day/week/month and readable detail panel behavior', () => {
  assert.ok(admin.includes("data-view='day'"));
  assert.ok(admin.includes("data-view='week'"));
  assert.ok(admin.includes("data-view='month'"));
  assert.ok(css.includes('min-width:320px'));
});

test('manual create appointment is date-aware and can open from calendar card', () => {
  assert.ok(admin.includes('data-open-create'));
  assert.ok(admin.includes("data-create-date"));
  assert.ok(adminJs.includes('createDate.value = isoDate(new Date())'));
});

test('time labels are aligned with dedicated class', () => {
  assert.ok(admin.includes('class=\'time-label\''));
  assert.ok(css.includes('.time-label'));
});

test('client surface keeps modal close behavior for mobile', () => {
  assert.ok(client.includes('data-open-modal'));
  assert.ok(client.includes('data-close-modal'));
});
