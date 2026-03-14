# Next Agent Start Here

1. Start from current branch HEAD with Phase 5B merged.
2. Keep Phase 5B contracts and service interfaces stable unless intentionally versioned.
3. Wire `AppointmentRepository` to persistent storage in future phase without altering aggregate semantics.
4. Do not mix client/public flow logic into admin action service.
5. Continue updating decision/risk/progress/session artifacts each milestone.

## Quick verification commands
- `pnpm install`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
