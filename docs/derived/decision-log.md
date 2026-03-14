# Decision Log

## 2026-03-14 — Phase 8B communications foundation implemented as internal event engine
- **Context**: Repository had no pre-existing app/runtime code, only source specification documents.
- **Decision**: Implement Phase 8B as a JavaScript workspace slice (`apps/api`, `packages/contracts`) with an internal communications engine, in-memory repository, and stub adapters.
- **Why**:
  - Preserves appointment-centered event model.
  - Keeps communication channels separated (client emails, SMS reminders, receipt/order emails, admin alerts).
  - Enforces server-side gating for SMS without relying on frontend locks.
  - Avoids premature coupling to real providers while creating production-grade extension points.
- **Consequences**:
  - Foundation is testable and buildable now.
  - Provider-specific integrations remain open follow-on work.
