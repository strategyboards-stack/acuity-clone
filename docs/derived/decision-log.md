# Decision Log

## 2026-03-14 — Phase 5A admin calendar foundation

- Established repository scaffolding with deterministic local scripts for install/typecheck/test/build validation.
- Implemented `apps/web/server.mjs` with server-side route gating using role cookie checks so admin calendar access control remains enforced on the server boundary.
- Introduced `packages/contracts` appointment aggregate/filter contract to preserve appointment as the central aggregate boundary for calendar operations.
- Chose conservative seeded in-memory calendar adapter for Phase 5A to deliver shell and interaction foundations without inventing persistence behavior.
- Deferred block-off-time and cancel/no-show/reschedule admin actions explicitly to later phases per scope lock.


## 2026-03-15 — Follow-up fixes for PR #13 review findings

- Hardened `verifyAdminSession` to fail closed when `ACUITY_SESSION_SECRET` is absent or left at development default, and to require signed `acuity_session` payload fields (`role`, `subject`, `expiresAt`).
- Kept admin-calendar gating on server boundary in `apps/web/server.mjs`, preserving shell-level separation while removing trust in unsigned client role cookies.
- Refined appointment filtering to use centralized datetime parsing and invalid-window guards, with regression coverage for timezone-offset and malformed range inputs.

## 2026-03-15 — Follow-up hardening refinements for Phase 5A

- Tightened admin session token parsing to enforce exactly two base64url segments before signature verification, reducing malformed token acceptance surface.
- Added auth regression coverage for tampered signatures, malformed token structure, non-admin role, and blank subject values.
- Added appointment record validity guard so malformed appointment durations (`endsAt < startsAt`) are excluded from filtered calendar results.

