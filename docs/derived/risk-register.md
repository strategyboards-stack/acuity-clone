# Risk Register

## Active

1. **RISK-COMM-001 — Upstream REQ ID mapping ambiguity**
   - Impact: Potential mismatch between derived IDs and future canonical breakdown.
   - Mitigation: Keep derived IDs scoped/documented and easy to remap in a follow-up normalization pass.

2. **RISK-COMM-002 — In-memory persistence in Phase 8A foundation**
   - Impact: Non-durable storage for templates/preferences/logs until persistence layer is added.
   - Mitigation: Domain interfaces and contract-first models established to support DB-backed repositories in next phase.

3. **RISK-COMM-003 — SMS/email delivery execution intentionally deferred**
   - Impact: Delivery cannot occur beyond foundation log/state orchestration.
   - Mitigation: Explicitly out-of-scope per Phase 8A; maintain adapter boundaries for providers.
