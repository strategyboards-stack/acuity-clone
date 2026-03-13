# Risk Register

## Active risks

1. **RISK-P3B-001: In-memory appointment storage**
   - Impact: Booking and confirmation state is process-local and non-persistent.
   - Mitigation: Phase 3B keeps aggregate boundary in `booking-core` to swap to persistent store in later phases without route changes.

2. **RISK-P3B-002: Direct-link proof model is conservative**
   - Impact: Query-flag proof (`direct=1`) is a conservative stand-in for signed/private distribution links.
   - Mitigation: Route and guard seams are explicit for later secure-token upgrade.

3. **RISK-P3B-003: Post-book action routes are foundation-only**
   - Impact: Edit/reschedule/cancel entry routes are scaffolded but not full workflows.
   - Mitigation: Foundations are wired to central appointment aggregate and documented as next-phase expansion.
