# Decision Log

## 2026-03-14 — Phase 4B bootstrap hardening for Codex runtime
- Context: Previous Phase 4B validation failed at package-manager/bootstrap stage due to package registry policy failures.
- Decision: Pin package manager via `packageManager` in root `package.json` and force npm public registry through `.npmrc` to avoid environment-specific mirror policies.
- Decision: Keep fixes minimal and targeted to installation/verification path without starting next phase product scope.
- Decision: Add lightweight CI scripts that verify baseline artifacts and route smoke path for self-service/authenticated-shell.
- Status: Implemented.
