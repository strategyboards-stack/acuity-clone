# Risk Register

## Open Risks

1. **Contributor RBAC granularity is under-evidenced**
   - Current gate permits only OWNER/ADMIN writes.
   - Risk: contributor subsets may need partial configuration rights later.

2. **Plan gating policy needs product confirmation**
   - Implemented conservative rule for free plan access only during trial.
   - Risk: real product may allow additional free-plan configuration operations.

3. **Public mobile coupon parity unresolved**
   - Phase 2B models coupon configuration only.
   - Risk: future public booking UI must choose parity behavior for mobile coupon input.

4. **Persistent repository integration pending**
   - In-memory repository used as default provider for current phase.
   - Risk: API runtime persistence wiring to Prisma must be completed in subsequent phases.
