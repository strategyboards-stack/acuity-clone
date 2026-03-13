# Risk Register

## Active risks

1. **R-4A-001: Placeholder identity storage**
   - **Risk**: Current foundation uses in-memory data and non-cryptographic password storage for scaffolding.
   - **Impact**: Not production-safe for real deployment.
   - **Mitigation**: Replace with persistent DB, password hashing, reset token workflow in next auth hardening phase.

2. **R-4A-002: REQ mapping ambiguity**
   - **Risk**: Source docs list REQ range without concrete per-ID mapping.
   - **Impact**: Potential mismatch with future phase naming.
   - **Mitigation**: Keep `req-index.md` as explicit working map and reconcile when canonical map is added.

3. **R-4A-003: Incomplete self-service lifecycle states**
   - **Risk**: Evidence indicates many authenticated client states are sparsely observed.
   - **Impact**: Some UI states may require iteration in future phases.
   - **Mitigation**: Maintain extensible route shells and API boundaries without overfitting assumptions.
