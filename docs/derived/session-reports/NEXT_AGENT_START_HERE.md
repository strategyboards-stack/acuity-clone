# Next Agent Start Here

## Where to continue
1. Build UI/admin routes that consume `MoneyFoundationService` outcomes for locked/empty states.
2. Implement persisted payment settings storage and API endpoints (without live provider SDK calls yet).
3. Extend invoice foundation into list/detail APIs with appointment-linked data reads.
4. Start Phase 7B scope only after preserving host-billing separation and dependency-state gating.

## Must preserve
- Scheduling money surfaces remain separate from host billing shell.
- Appointment remains central aggregate boundary.
- Gating always uses plan + verification + dependency state, not plan alone.
