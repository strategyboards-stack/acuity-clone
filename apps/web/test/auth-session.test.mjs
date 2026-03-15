import test from 'node:test';
import assert from 'node:assert/strict';
import { createSignedSessionToken, verifyAdminSession } from '../src/auth-session.js';

const secret = 'test-secret';
const now = Date.parse('2026-03-10T00:00:00.000Z');

test('rejects forged admin role cookie without signed session', () => {
  const req = { headers: { cookie: 'acuity_role=admin' } };
  assert.equal(verifyAdminSession(req, { now, secret }), false);
});

test('accepts valid signed admin session and rejects expiry', () => {
  const validToken = createSignedSessionToken({ role: 'admin', expiresAt: now + 60_000 }, secret);
  const expiredToken = createSignedSessionToken({ role: 'admin', expiresAt: now - 1 }, secret);

  assert.equal(verifyAdminSession({ headers: { cookie: `acuity_session=${validToken}` } }, { now, secret }), true);
  assert.equal(verifyAdminSession({ headers: { cookie: `acuity_session=${expiredToken}` } }, { now, secret }), false);
});

test('rejects sessions when secret is missing or unset', () => {
  const token = createSignedSessionToken({ role: 'admin', expiresAt: now + 60_000 }, secret);
  const req = { headers: { cookie: `acuity_session=${token}` } };

  assert.equal(verifyAdminSession(req, { now, secret: undefined }), false);
  assert.equal(verifyAdminSession(req, { now, secret: 'dev-only-change-me' }), false);
});

test('rejects tampered signatures and malformed session tokens', () => {
  const validToken = createSignedSessionToken({ role: 'admin', expiresAt: now + 60_000 }, secret);
  const tampered = `${validToken}x`;
  const malformed = 'not.valid.token';

  assert.equal(verifyAdminSession({ headers: { cookie: `acuity_session=${tampered}` } }, { now, secret }), false);
  assert.equal(verifyAdminSession({ headers: { cookie: `acuity_session=${malformed}` } }, { now, secret }), false);
});

test('rejects non-admin or missing-subject sessions', () => {
  const memberToken = createSignedSessionToken({ role: 'member', subject: 'u-1', expiresAt: now + 60_000 }, secret);
  const missingSubjectToken = createSignedSessionToken({ role: 'admin', subject: '   ', expiresAt: now + 60_000 }, secret);

  assert.equal(verifyAdminSession({ headers: { cookie: `acuity_session=${memberToken}` } }, { now, secret }), false);
  assert.equal(verifyAdminSession({ headers: { cookie: `acuity_session=${missingSubjectToken}` } }, { now, secret }), false);
});
