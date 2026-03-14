# Risk Register

## 2026-03-14

### R-8B-001 — Source spec lacks explicit REQ-ID-to-feature matrix
- **Impact**: Potential drift in ID naming across future phases.
- **Mitigation**: Added conservative REQ mapping for Phase 8B in `docs/derived/req-index.md`; future phases should reconcile if canonical mapping appears.

### R-8B-002 — In-memory communication storage is non-durable
- **Impact**: No persistence across process restarts.
- **Mitigation**: Repository abstraction isolates persistence concerns so Phase 8C can swap DB-backed implementation without changing engine contracts.

### R-8B-003 — Provider adapters are stubs by scope decision
- **Impact**: Delivery outcomes are simulated in tests and local runtime.
- **Mitigation**: Channel adapter interface and error model already match planned provider integration workflow.
