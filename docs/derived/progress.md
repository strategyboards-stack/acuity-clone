# Progress

## Current Phase
- **Phase 11A — Mobile hardening and responsive parity**
- **Status:** In progress (kickoff artifacts complete)

## Pre-coding milestone verification (required)

### 1) Exact REQ IDs in scope
- REQ-011A-01 through REQ-011A-08 (see `docs/derived/req-index.md`).

### 2) Dependencies
- Source spec baseline files in `docs/source` (Part 11 primary, Part 10 mobile delta).
- Existing route/shell implementation from prior accepted phases (not present in current snapshot).
- Preview environment route map for public scheduler + client + admin core.

### 3) Edge cases
- Mobile coupon/gift-code field parity decision vs observed mobile omission.
- Collapsed admin nav discoverability for deep modules.
- Long forms with Save/primary CTA below fold.
- Modal nested scroll and back/close recoverability.
- Touch ergonomics for reschedule/time-picker style interactions.
- 768x1024 tablet split behavior versus phone breakpoints.

### 4) Exact file plan
- Keep all work in shared route components/layout primitives (no mobile-only business logic forks).
- Harden:
  - public booking shell/components
  - client self-service modal flows
  - admin core layout/navigation + form action bars
  - shared modal primitives for scroll containment and close behavior
- Verify against viewport matrix in Phase 11A checkpoint.

### 5) Acceptance criteria
- Public booking, client self-service, and admin core are usable and discoverable across all target viewports.
- Primary CTAs are always reachable (sticky or recoverable behavior).
- Modal content scrolls without body-lock regressions; close/back always returns user context.
- Admin calendar remains functional/unregressed.
- No new mobile-only business rules introduced.

## Implementation update (this run)
- Added runnable web app surface in `apps/web` with admin-calendar-first mobile hardening.
- Added mobile navigation toggle, overflow-safe layout, mobile detail panel drawer behavior, and sticky action bar for Admin Calendar.
- Extended responsive pass to public booking and client self-service with mobile-safe forms and modal close behavior.
- Added verification scripts and tests wired through root `pnpm` scripts.
- Fixed Phase 11A Admin Calendar blockers: month-view detail readability, manual create date selection, and time-label alignment.
- Fixed functional interaction blockers: admin calendar action buttons now execute behaviors, shell nav is route-backed, booking continue advances flow, and client reschedule open/close/save are operational.
- Verified `/booking/demo` was previously UI-only for confirm state; implemented real appointment persistence through `/api/appointments` backed by `data/appointments.json`.
- Unified the appointment loop: newly created bookings now appear in `/admin/calendar` and `/client` by reading from shared `/api/appointments` data source.
- Implemented real availability exclusion: admin Block Off Time now prevents booking those slots in `/booking/demo`; Day/Week/Month now render genuinely different calendar projections.
- Phase 11A checkpoint is now complete for this pass and acceptable to close; remaining items are non-blocking under-evidenced expansion areas.
