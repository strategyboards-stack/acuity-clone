# Decision Log

## 2026-03-13 — Phase 3A public scheduler foundation implemented in `apps/web`
- Adopted a minimal Next.js App Router web app to establish production-grade route shells for the public scheduler.
- Implemented explicit visibility filtering server-side in domain utility code to enforce Phase 2B visibility boundaries.
- Added direct-link route (`/schedule/[slug]`) that resolves private-direct-link services without exposing them in the public catalog.
- Implemented conservative slot generation and recurring booking scaffold as UI foundation only; booking submission/payment/client self-service intentionally deferred.

## Assumptions
- REQ-001..REQ-007 were indexed in `docs/derived/req-index.md` from the Part 11 public scheduler requirements block because the source corpus references REQ ranges but does not enumerate each ID line-by-line.
