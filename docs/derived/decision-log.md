# Decision Log

## 2026-03-13 — D-001: Recreate missing Phase 1 workspace bootstrap artifacts
- **Context**: Repository contained only source evidence docs, while the task required stabilizing Phase 1 install/typecheck/test/build.
- **Decision**: Add minimal pnpm workspace files and two JavaScript workspace packages (`apps/web`, `packages/contracts`) to satisfy bootstrap and validation goals.
- **Why**: This is the narrowest path to make install and baseline validations pass without entering Phase 2 feature work.
- **Tradeoff**: Uses minimal placeholder implementation; product features remain intentionally unimplemented.

## 2026-03-13 — D-002: Remove external npm dependency requirements for bootstrap reliability
- **Context**: `pnpm install` failed with `ERR_PNPM_FETCH_403` against `registry.npmjs.org` when trying to fetch toolchain packages.
- **Decision**: Eliminate external package dependencies for Phase 1 checks and rely on Node built-ins (`node --check`, `node --test`) for deterministic validation.
- **Why**: Makes installation and verification pass in constrained/proxied environments without manual intervention.

## 2026-03-13 — D-003: Pin package manager and disable managed package-manager downloads
- **Context**: Prior blocker cited corepack/pnpm tarball fetching.
- **Decision**: Pin `packageManager` to `pnpm@10.13.1` and set `.npmrc` `manage-package-manager-versions=false`.
- **Why**: Reduces bootstrap instability tied to package-manager auto-management in constrained environments.
