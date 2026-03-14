# NEXT_AGENT_START_HERE

## Resume Point
Phase 9B contracts and tests are completed. Start next work by wiring these contracts into API endpoints and admin UI shells without changing the Phase 9B boundary decisions.

## Guardrails to keep
1. Do not collapse one-way ICS publication into two-way sync.
2. Keep integrations as adapters over internal events.
3. Preserve explicit provider connection states.
4. Maintain server-side gating inputs: role, plan, trial, dependency, verification.

## Suggested next execution slice
- Implement API route layer consuming `@acuity/contracts` for:
  - API credential state read/rotate stub
  - webhook endpoint CRUD state handling (no outbound delivery yet)
  - provider inventory/state listing for sync and ICS publication config
