# Decision Log

## 2026-03-13 — Phase 1 platform shell bootstrap
- Implemented a pnpm + turborepo monorepo with required `apps/*` and `packages/*` structure.
- Chose Next.js 15 for `apps/web`, NestJS for `apps/api`, and BullMQ worker shell for `apps/worker` to align with AGENTS guidance.
- Created explicit route-group boundaries in web app for `(public)`, `(auth)`, `(workspace)`, and `(account)` and kept account surfaces separate.
- Implemented shared entitlement contract in `@acuity/contracts` and enforced it in both web middleware and API middleware.
- Added initial Prisma schema/migration for account/workspace/user shell entities only; deferred product aggregates to later phases.
- Assumption: REQ-001..REQ-006 represent Phase 1 subset derived from Part 11 REQ-001..REQ-029 umbrella because granular mapping was not enumerated in source docs.
