# Decision Log

## 2026-03-14 — Phase 6B bootstrap stabilization in minimal repository snapshot

- **Context:** The repository snapshot only contains source specification documents and no application/workspace code (no `apps/`, `packages/`, or prior Phase 6B implementation files).
- **Decision:** Add a minimal pnpm workspace bootstrap (`package.json`, `pnpm-workspace.yaml`, `.npmrc`) pinned to `pnpm@10.13.1`, which matches the Codex environment's already-installed pnpm version.
- **Rationale:** Prior run failed on `corepack` fetching `pnpm@9.12.0` with a `403`. Pinning to an already-available version removes that fetch path and makes install deterministic in this environment.
- **Decision:** Add explicit validation scripts for `typecheck`, `test`, and `build` so required CI-style checks can execute successfully within current repo contents.
- **Decision:** Keep CRM smoke validation as a non-failing skip message because no runnable web/api app exists in this repository snapshot.
