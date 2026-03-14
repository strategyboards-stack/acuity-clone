# Progress Report

## Current phase
- **Phase 7A — Money surfaces foundation**

## Pre-coding restatement

### 1) REQ IDs in scope
- REQ-018 payment settings foundation separation from host billing.
- REQ-019 processor connection shell/state modeling.
- REQ-020 payment-at-booking dependency-aware policy.
- REQ-021 invoice foundation linked to appointment aggregate.
- REQ-022 admin empty/locked states for processor-connected vs missing.

### 2) Dependencies
- Server-aware gating dimensions: plan, verification, processor provider, processor state.
- Shared contracts package for consistent API + future web usage.
- Appointment ID required in invoice draft foundation.

### 3) Edge cases
- Processor provider exists but state is `reauth_required`/`action_required`/`error`.
- Processor never connected (`provider = null`, `state = never_connected`).
- Plan allows feature but verification incomplete.
- Invalid deposit percent in payment-at-booking deposit mode.

### 4) Exact file plan
- Create monorepo baseline configs for build/test/typecheck execution.
- Add `packages/contracts` money contracts.
- Add `apps/api` money foundation service + tests.
- Update derived documents and session handoff artifacts.

### 5) Acceptance criteria
- Payment dependency states are modeled and enforced server-side.
- Payment-at-booking policies degrade safely when dependencies fail.
- Invoice draft foundation includes collectability + lock reasons.
- Admin state model distinguishes processor-missing lock from processor-connected empty invoices.
- `pnpm install`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass.

## Implementation status
- Completed Phase 7A foundation contracts, service logic, and tests.
