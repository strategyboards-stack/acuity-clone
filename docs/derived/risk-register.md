# Risk Register

## Open risks

1. **Mocked auth/session verification**
   - Impact: medium
   - Scope: Phase 4B self-service auth gating
   - Detail: Token verification is currently in-memory until API auth surfaces are implemented.
   - Mitigation: Replace `loadClientSelfService` and token storage with server session validation in upcoming API phase.

2. **No live appointment mutation in action entries**
   - Impact: medium
   - Scope: edit/reschedule/cancel flow depth
   - Detail: Phase 4B provides authenticated entrypoints but not downstream mutation forms.
   - Mitigation: Implement full appointment mutation UX/API in next client self-service phase while preserving action-entry contract.
