# Decision Log

## 2026-03-14 — Phase 10A reports foundation starts from minimal repository

- Adopted a minimal monorepo baseline (`apps/web`, `packages/contracts`) to implement report foundations with typed shared contracts.
- Chose a conservative report dataset model that keeps `Appointment`-centric rows and summary metrics while remaining extensible for full aggregation later.
- Implemented report gating as server-aware evaluation (`role`, `trialState`, `dependencyState`, `verificationState`) to avoid frontend-only gating.
- Kept Intake Forms report behavior strict: dataset remains empty until explicit question selection submission.
- Explicitly excluded Manage Users and host billing shell from this phase implementation to preserve architecture boundaries.
