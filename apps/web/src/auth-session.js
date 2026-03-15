import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_SESSION_SECRET = 'dev-only-change-me';

function base64UrlEncode(value) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function parseCookieHeader(cookieHeader = '') {
  const entries = cookieHeader.split(';').map((part) => part.trim()).filter(Boolean);
  return entries.reduce((acc, entry) => {
    const index = entry.indexOf('=');
    if (index <= 0) return acc;
    const key = entry.slice(0, index).trim();
    const value = entry.slice(index + 1).trim();
    acc[key] = value;
    return acc;
  }, {});
}

function signPayload(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSignedSessionToken({ role, subject = 'seed-admin', expiresAt }, secret = DEFAULT_SESSION_SECRET) {
  const payload = base64UrlEncode(JSON.stringify({ role, subject, expiresAt }));
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function verifyAdminSession(req, { now = Date.now(), secret = process.env.ACUITY_SESSION_SECRET || DEFAULT_SESSION_SECRET } = {}) {
  const cookies = parseCookieHeader(req.headers.cookie || '');
  const token = cookies.acuity_session;
  if (!token) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expectedSignature = signPayload(payload, secret);
  const provided = Buffer.from(signature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false;

  let session;
  try {
    session = JSON.parse(base64UrlDecode(payload));
  } catch {
    return false;
  }

  if (session.role !== 'admin') return false;
  if (!Number.isFinite(session.expiresAt) || session.expiresAt <= now) return false;
  return true;
}
