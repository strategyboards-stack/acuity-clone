# Risk Register

## RISK-7A-01: Under-evidenced post-connect processor states
- **Status**: Open
- **Impact**: Medium
- **Detail**: Evidence confirms state categories but not full provider-specific transitions after connect/disconnect/re-auth flows.
- **Mitigation**: Preserve explicit connection-state enum and lock-reason plumbing server-side for future provider adapters.

## RISK-7A-02: Invoice UX specifics in non-empty states are under-evidenced
- **Status**: Open
- **Impact**: Medium
- **Detail**: Evidence strongly covers shell visibility and dependency warnings, but not full populated invoice table behaviors.
- **Mitigation**: Foundation exposes `emptyStateKey`, `collectableNow`, and lock reasons so UI can evolve without business-rule rewrites.
