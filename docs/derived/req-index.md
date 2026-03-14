# REQ Index

## Phase anchor
- Current implementation scope: **Phase 4B – Client self-service stabilization and validation only**.
- Source of truth: `docs/source/part-11-clone-spec.txt` (REQ-001 through REQ-029 baseline).

## In-scope REQ IDs for this run
- REQ-002 (Client self-service shell parity)
- REQ-015 (Cross-surface stability and route consistency)
- REQ-028 (Mobile/shared logic parity guardrail)
- REQ-029 (Host-shell boundary preservation)

## Validation criteria used in this run
- Install must complete in this environment.
- `pnpm typecheck`, `pnpm test`, and `pnpm build` must pass.
- Minimal smoke probe must confirm client and authenticated shell endpoints respond.
