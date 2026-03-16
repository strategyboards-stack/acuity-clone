# Decision Log

## 2026-03-16 — D-011A-001: Phase 11A execution mode in current repository snapshot
- **Context:** User requested immediate start of Phase 11A (mobile hardening/responsive parity), with Phases 1–10C already accepted as green.
- **Observed repository state:** Current repository snapshot contains source documents only (`docs/source/*`) and no application/runtime code trees (`apps/*`, `packages/*`).
- **Decision:** Start Phase 11A in repository-first mode by producing concrete implementation controls: REQ scope, dependency map, viewport matrix, route-first QA plan, acceptance criteria, and checkpoint/handoff updates in `docs/derived/*`.
- **Why:** This allows immediate execution and review traceability without inventing non-existent code or creating separate mobile business logic.
- **Follow-up:** When application code is present in this repository snapshot, execute the same acceptance matrix against existing routes and components.

## 2026-03-16 — D-011A-002: Canonical first-route mobile review target
- **Context:** User requested exact first route to open for mobile review.
- **Decision:** First mobile review target is the **public scheduling route** for the active scheduling page slug: `/booking/:slug`.
- **Why:** Part 10 prioritizes public booking as a core validated mobile surface and Phase 11A scope item #1 requires responsive parity for public booking.
- **Assumption handling:** The exact concrete slug is environment-dependent; evaluator should substitute the preview’s seeded slug.

## 2026-03-16 — D-011A-003: Implemented shared responsive web surfaces with admin-calendar-first hardening
- **Context:** Follow-up required actual code implementation (not docs-only kickoff), prioritizing Admin Calendar slice.
- **Decision:** Implemented runnable web surfaces under `apps/web` with shared route behavior and responsive CSS/JS for admin calendar, public booking, and client self-service.
- **Why:** Satisfies Phase 11A scope while preserving single-domain logic and keeping manual preview review unblocked.
