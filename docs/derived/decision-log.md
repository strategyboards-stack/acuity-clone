# Decision Log

## 2026-03-14 — Phase 5B implementation baseline
- **Context**: Repository had only source research docs and no executable app/api code.
- **Decision**: Implement Phase 5B as a production-ready TypeScript service/domain slice with shared contracts and tests, centered on the appointment aggregate.
- **Why**: This satisfies admin calendar action behavior (block, cancel, no-show, reschedule) while preserving architectural boundaries and allowing future API/web integration.
- **Consequences**:
  - Added request contracts with strict validation and confirmation requirements.
  - Added appointment aggregate state transitions and audit event emission.
  - Added admin action service with server-side role/verification/dependency gating.
  - Added test coverage for action success and gating failures.

## 2026-03-14 — REQ ID normalization for in-repo execution
- **Context**: Part 11 states REQ-001..REQ-029 exist, but no concrete in-repo numbered requirement table was present.
- **Decision**: Define explicit Phase 5B REQ IDs (REQ-010..REQ-016) in `docs/derived/req-index.md` for traceable implementation and testing.
- **Why**: Enables deterministic scope control and acceptance validation.
- **Consequences**: Future phases should retain or supersede this index while preserving traceability.
