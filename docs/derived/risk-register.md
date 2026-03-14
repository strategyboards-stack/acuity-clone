# Risk Register

## RISK-5B-001 — REQ numbering provenance gap
- **Description**: Source docs reference REQ-001..REQ-029 globally but do not provide a repository-native numbered breakdown.
- **Impact**: Potential mismatch in future cross-phase traceability.
- **Mitigation**: Local normalized REQ mapping established in `docs/derived/req-index.md` and explicitly logged in decision log.
- **Status**: Open (monitor).

## RISK-5B-002 — Persistence backend not yet integrated
- **Description**: Phase 5B service currently validated with in-memory repository in tests.
- **Impact**: Production DB persistence wiring remains a follow-on task.
- **Mitigation**: Repository interface is explicit and keeps aggregate boundaries stable for future Prisma/Nest integration.
- **Status**: Open (acceptable for this slice).

## RISK-5B-003 — Contributor permission granularity under-evidenced
- **Description**: Current gating blocks contributor destructive actions entirely.
- **Impact**: May need refinement once granular RBAC evidence is available.
- **Mitigation**: Maintain conservative default deny and keep auth context fields extensible.
- **Status**: Open.
