# Decision Log (Derived)

## 2026-03-14 — Phase 6B CRM operations implemented as domain-first module

- Implemented Phase 6B in a domain-first CRM repository/service layer under `apps/web/src/crm`.
- Added contracts in `packages/contracts` for:
  - action types
  - import/export payloads
  - destructive confirmation payloads
  - audit/state-transition payload shape
- Chosen conservative CSV foundation:
  - single-client detail export and bulk export are CSV-only in this slice
  - import validates row-level requirements and returns `invalidRows` instead of all-or-nothing failure
- Added explicit client-side destructive confirmation helper requiring action keyword (`BAN` / `DELETE`).
- Added explicit CRM action-state machine (`idle`/`running`/`success`/`error`) for deterministic UI handling.
- Added tests for contracts and CRM operation behaviors.

### Assumption logged

Exact Acuity CSV column parity is under-evidenced in source materials, so this slice establishes stable internal CSV headers and row-level invalid reporting as extensible foundation.
