# Risk Register

## Active risks

1. **Granular contributor RBAC remains under-evidenced**
   - Impact: role matrix may require refactor when deeper permissions evidence is available.
   - Mitigation: current foundation isolates policy evaluation and contract schema to keep future role expansion localized.

2. **Post-verification invite lifecycle details are partially evidenced**
   - Impact: resend/revoke/accept flows may differ from production behavior.
   - Mitigation: invitation state model includes lifecycle statuses and explicit verification dependency flag.

3. **Plan gating specifics for Manage Users beyond trial/standard/premium are incomplete**
   - Impact: enterprise variants may require extra dependency checks.
   - Mitigation: policy layer includes dependency-state lock reason and can absorb additional plan states.
