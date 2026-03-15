import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_SESSION_SECRET = 'dev-only-change-me';
const BASE64URL_SEGMENT = /^[A-Za-z0-9_-]+$/;

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

function parseSessionToken(token) {
  if (typeof token !== 'string') return null;
  const segments = token.split('.');
  if (segments.length !== 2) return null;

  const [payload, signature] = segments;
  if (!payload || !signature) return null;
  if (!BASE64URL_SEGMENT.test(payload) || !BASE64URL_SEGMENT.test(signature)) return null;

  return { payload, signature };
}

export function createSignedSessionToken({ role, subject = 'seed-admin', expiresAt }, secret = DEFAULT_SESSION_SECRET) {
  const payload = base64UrlEncode(JSON.stringify({ role, subject, expiresAt }));
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function verifyAdminSession(
  req,
  { now = Date.now(), secret = process.env.ACUITY_SESSION_SECRET } = {}
) {
  if (!secret || secret === DEFAULT_SESSION_SECRET) return false;

  const cookieHeader = req?.headers?.cookie || '';
  const cookies = parseCookieHeader(cookieHeader);
  const tokenParts = parseSessionToken(cookies.acuity_session);
  if (!tokenParts) return false;

  const expectedSignature = signPayload(tokenParts.payload, secret);
  const provided = Buffer.from(tokenParts.signature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false;

  let session;
  try {
    session = JSON.parse(base64UrlDecode(tokenParts.payload));
  } catch {
    return false;
  }

  if (session.role !== 'admin') return false;
  if (typeof session.subject !== 'string' || session.subject.trim().length === 0) return false;
  if (!Number.isFinite(session.expiresAt) || session.expiresAt <= now) return false;
  return true;
}
