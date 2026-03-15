# Risk Register

## Active risks

1. **REQ evidence granularity risk**
   - Source docs mention REQ-001..REQ-029 range but do not enumerate each item in the repository snapshot.
   - Mitigation: maintain derived REQ index and map Phase 5A to conservative, explicit REQ IDs.

2. **Auth integration risk**
   - Server-aware auth gating currently uses cookie-based role placeholder and dev fallback.
   - Mitigation: preserve `requireAdmin()` boundary so real identity provider integration can replace internals without route refactor.

3. **Calendar data fidelity risk**
   - Phase 5A uses seeded data adapter rather than persisted API-backed data.
   - Mitigation: centralize query shape contract to enable later API integration with minimal UI churn.
