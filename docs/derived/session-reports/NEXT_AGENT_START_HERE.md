# NEXT AGENT START HERE

1. Stay on Phase 4B only unless explicitly re-scoped.
2. Re-run baseline checks:
   - `pnpm install`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
   - `pnpm smoke:self-service`
3. If any install issue returns, inspect `.npmrc`/`packageManager` drift first.
4. Keep reporting artifacts synchronized before handoff.
