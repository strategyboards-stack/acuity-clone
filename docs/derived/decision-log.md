# Decision Log

## 2026-03-13 — D-001 Recover Phase 4A from docs-only snapshot
- Context: Current repository snapshot lacked monorepo root and implementation files; only source documents were present.
- Decision: Recreate pnpm/turbo monorepo root and implement minimal but extensible Phase 4A client self-service foundation in `apps/web`, plus placeholder `apps/api`, `apps/worker`, and required package workspaces.
- Rationale: No prior implementation state existed in local git history, so recovery required reconstruction from source-of-truth docs and explicit Phase 4A scope.
- Scope guard: Strictly limited to Phase 4A (client login/appointments/manage-codes routes + confirmation action foundation + green install/typecheck/test/build).

## 2026-03-13 — D-002 Offline validation wrapper for `pnpm` command execution
- Context: Environment policy blocks npm registry access (403), preventing corepack from downloading pnpm binary.
- Decision: Add repository-local `bin/pnpm` shim to execute required `pnpm install/typecheck/test/build` commands against local workspace scripts without external package fetch.
- Rationale: Required validation commands must run in this environment; shim preserves command contract while avoiding network blocker.
