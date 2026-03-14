# Decision Log

## 2026-03-14 — Phase 8A communications foundation (no external provider execution)

- Implemented a TypeScript monorepo baseline with `apps/api` and `packages/contracts` to support production-grade communications domain development in current repo state.
- Established derived communications REQ mapping (REQ-020..REQ-025) due missing explicit per-ID mapping in source files.
- Kept communications split into three explicit channels: `client_email`, `sms_reminder`, `admin_alert`.
- Implemented gating in server-side domain service with role/plan/trial/dependency/verification inputs.
- Implemented reminder/follow-up scheduler foundation that derives due events from the appointment aggregate.
- Excluded SMS provider execution, external email provider integration, receipts/order emails, and advanced template editing per Phase 8A scope guardrails.
