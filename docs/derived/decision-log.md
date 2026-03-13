# Decision Log

## 2026-03-13 — Phase 4A bootstrap on empty repository
- **Context**: Repository started with source docs only; required derived docs and implementation scaffolding were absent.
- **Decision**: Created a pnpm/turborepo workspace with `apps/web` and `packages/contracts` as minimum viable structure for Phase 4A.
- **Why**: Aligns with AGENTS mandatory repository structure while keeping work constrained to client self-service foundation.

## 2026-03-13 — REQ ID working map for Phase 4A
- **Context**: Source specs mention REQ-001..REQ-029 but do not include concrete mappings in repo.
- **Decision**: Established Phase 4A working IDs REQ-004..REQ-010 in `docs/derived/req-index.md`.
- **Why**: Needed explicit in-scope identifiers before implementation per execution model.

## 2026-03-13 — Session/auth foundation choice
- **Decision**: Implemented server cookie-based session foundation with middleware gating for `/client` routes and API-side auth checks.
- **Why**: Enforces server-aware gating and keeps public booking and authenticated self-service boundaries separate.

## 2026-03-13 — Central appointment aggregate boundary
- **Decision**: Added shared contract schemas in `packages/contracts`, including `AppointmentAggregateSchema` consumed by self-service surfaces.
- **Why**: Preserves appointment as central aggregate for client-facing appointment list foundation.
