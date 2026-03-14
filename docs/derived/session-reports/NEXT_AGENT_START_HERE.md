# Next Agent Start Here

Phase 10A is complete and stable in this repository state.

## Revalidation commands
1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build`

## Notes
- `packageManager` is pinned to `pnpm@10.23.0` to match cached corepack availability in Codex.
- Keep any follow-up changes out of Phase 10A unless a regression is found.
