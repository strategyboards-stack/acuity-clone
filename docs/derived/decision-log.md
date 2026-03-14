# Decision Log

## 2026-03-14 — Phase 10B foundation architecture
- Established a dedicated host-shell route boundary (`/host/manage-users`) that is intentionally separate from scheduling-admin routes.
- Implemented a server-aware access policy evaluator that computes Manage Users access from role, plan, verification, and dependency readiness.
- Modeled invitation lifecycle as an explicit contract type (`not_sent`, `pending`, `accepted`, `expired`, `revoked`) to preserve extensibility.
- Implemented transfer-ownership and invite-contributor as foundation actions (UI + policy gating), without enterprise-only role matrix expansion.
