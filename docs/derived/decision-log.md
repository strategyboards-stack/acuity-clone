# Decision Log

## 2026-03-14 — DLOG-006A-01: Phase 6A scaffold uses static web app with zero external runtime dependencies

- **Context**: Repository had source documents only; no runnable app scaffold existed.
- **Decision**: Created a minimal monorepo-aligned layout with `apps/web` static admin surface, placeholder packages, and CRM foundation UI/logic in one deployable artifact.
- **Rationale**: Allows Phase 6A delivery with install/typecheck/test/build validation in a restricted environment.
- **Consequences**: Data persistence is currently in-memory seed data and must be replaced by DB-backed API in a later phase.

## 2026-03-14 — DLOG-006A-02: Preserve appointment-centric boundary in CRM foundation

- **Context**: CRM requires appointment context without moving booking core into CRM.
- **Decision**: Client detail panel exposes read-only upcoming appointment count and last-appointment timestamp while keeping no scheduling mutation in CRM slice.
- **Rationale**: Preserves appointment as central aggregate and separation between CRM admin UX and booking logic.
- **Consequences**: Deeper appointment drill-down remains a future enhancement.

## 2026-03-14 — DLOG-006A-03: Server-aware CRM gate retained through role-aware entry contract

- **Context**: Scope requires server-aware auth/gating to remain intact.
- **Decision**: Added role gate helper and role-aware surface loading contract (`?role=` defaulting to owner for local runs).
- **Rationale**: Avoids frontend-only role scattering and keeps a replacement seam for real server session middleware.
- **Consequences**: Integration with real auth/session provider is still required.
