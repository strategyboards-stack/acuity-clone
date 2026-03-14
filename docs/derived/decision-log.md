# Decision Log

## 2026-03-14 — Phase 5A admin calendar foundation

- Established repository scaffolding with deterministic local scripts for install/typecheck/test/build validation.
- Implemented `apps/web/server.mjs` with server-side route gating using role cookie checks so admin calendar access control remains enforced on the server boundary.
- Introduced `packages/contracts` appointment aggregate/filter contract to preserve appointment as the central aggregate boundary for calendar operations.
- Chose conservative seeded in-memory calendar adapter for Phase 5A to deliver shell and interaction foundations without inventing persistence behavior.
- Deferred block-off-time and cancel/no-show/reschedule admin actions explicitly to later phases per scope lock.
