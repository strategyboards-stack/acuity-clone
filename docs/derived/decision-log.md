# Decision Log

## 2026-03-14 — Phase 4B client self-service implementation baseline
- Implemented Phase 4B as a focused client self-service slice in `apps/web` with explicit authenticated shell routing for appointments, manage codes, logout, and action entries.
- Preserved appointment as central aggregate boundary by reusing `appointmentId` + `publicCode` identity in all authenticated action entry links (edit-info/reschedule/cancel).
- Introduced `@acuity/contracts` package to enforce shared self-service contract typing across UI and tests.
- Chosen conservative server-aware auth simulation (`loadClientSelfService`) because repository has no backend service yet; invalid/missing token is handled as explicit unauthorized state and logged as implementation risk.
