# Next Agent Start Here

1. Stay in **Phase 6B**; do not start next phase.
2. Verify bootstrap remains stable:
   - `./scripts/bootstrap-pnpm.sh`
   - `pnpm install`
3. Re-run validations:
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
4. If application code is restored in repo snapshot, replace smoke-skip with real CRM operations smoke validation and update risk register.
