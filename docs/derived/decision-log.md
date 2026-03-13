# Decision Log

## 2026-03-13 — Phase 2A scheduling foundation bootstrap

- Implemented Phase 2A domain foundation focused on scheduling configuration only: calendars, locations, availability rules, availability overrides, resources, and global scheduling limits.
- Added Prisma schema plus SQL migration with `Appointment` retained as a central aggregate anchor to avoid coupling integrations directly into booking core.
- Added contract-level validation utilities and service-level guardrails for minute-range/date-range correctness in availability rules and overrides.
- Repository environment blocked registry package downloads, so validation pipeline was implemented with dependency-free Node scripts (`typecheck`, `test`, `build`) to keep install/build/test loop green in current constraints.
- Assumption: REQ IDs are mapped conservatively for Phase 2A due absent per-REQ decomposition files in current repository state.
