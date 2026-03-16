import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('apps/web/public/assets/styles.css', 'utf8');
const admin = fs.readFileSync('apps/web/public/admin/calendar/index.html', 'utf8');
const client = fs.readFileSync('apps/web/public/client/index.html', 'utf8');

test('includes mobile viewport hardening breakpoints', () => {
  for (const bp of ['820px', '430px']) {
    assert.ok(css.includes(bp));
  }
});

test('admin calendar has detail panel controls and sticky actions', () => {
  assert.ok(admin.includes('data-open-detail'));
  assert.ok(admin.includes('data-close-detail'));
  assert.ok(admin.includes('sticky-actions'));
});

test('client surface keeps modal close behavior for mobile', () => {
  assert.ok(client.includes('data-open-modal'));
  assert.ok(client.includes('data-close-modal'));
});
