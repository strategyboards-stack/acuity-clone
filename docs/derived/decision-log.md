# Decision Log

## 2026-03-13 — Phase 2B bootstrap on sparse repository

- Established a workspace monorepo scaffold (`apps/*`, `packages/*`) with root install/typecheck/test/build scripts to satisfy validation and required structure constraints.
- Implemented Phase 2B API behavior in `apps/api` as typed service-layer logic with repository abstraction and in-memory default repository.
- Added Prisma schema and SQL migration artifacts under `packages/db` for appointment type/add-on/coupon/intake form entities plus account/member gate context fields.
- Chose conservative server-side feature gate policy requiring OWNER/ADMIN role, verification-ready state, dependency-ready state, and non-free-or-trial eligibility.
- Deferred public booking/client self-service route implementation; only public projection filtering behavior for catalog visibility is included.
