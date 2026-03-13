# NEXT_AGENT_START_HERE

1. Read `AGENTS.md` and source docs (Part 11 then 07–10) before changes.
2. Use `docs/derived/req-index.md` for current REQ mapping.
3. Do not alter Phase 1 boundaries:
   - keep `(account)` host-shell routes separate from `(workspace)` routes
   - keep entitlement evaluation in shared middleware and contracts
4. Run validation baseline:
   - `pnpm install`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
5. Continue with next phase only; do not regress shell architecture.
