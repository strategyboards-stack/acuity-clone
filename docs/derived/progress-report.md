# Progress Report

## Current phase

- **Phase 8A — Communications foundation**

## Pre-coding scope checkpoint

1. **REQ IDs in scope**: REQ-020, REQ-021, REQ-022, REQ-023, REQ-024, REQ-025.
2. **Dependencies**:
   - Appointment aggregate as central boundary.
   - Server-side feature gating inputs (role, plan, trial, dependency, verification).
   - Contracts for channel separation and message state.
3. **Edge cases**:
   - Free plan must not unlock SMS editing while client emails/admin alerts remain independent.
   - Unverified account/dependency missing states must disable edits while preserving visibility.
   - Cancelled appointments should not emit reminder/follow-up due events.
   - Template interpolation must fail safely for missing merge fields.
4. **File plan**:
   - Workspace/package setup (`package.json`, `pnpm-workspace.yaml`, TS configs).
   - Contracts (`packages/contracts/src/communications.ts`).
   - API domain foundation (`apps/api/src/communications/foundation.ts`, exports).
   - Tests (`apps/api/test/communications.foundation.test.ts`).
   - Derived docs + session handoff docs/checkpoint updates.
5. **Acceptance criteria**:
   - Distinct domain/state models for client email, SMS reminder, admin alert.
   - Reminder/follow-up foundation rooted in appointment aggregate.
   - Notification preferences + delivery log foundation present.
   - Server-aware communications gating present.
   - No external provider execution for SMS/email and no receipts/order emails.

## Delivered

- Implemented contracts and communications foundation services for gating, templates, reminder/follow-up due events, notification preferences, and delivery logs.
- Added tests proving channel separation, template foundation rendering, preference/log state behavior, and appointment-driven due event derivation.
- Updated required derived/session documentation for handoff continuity.

## Validation run results

- `npm install --ignore-scripts`: pass (local workspace only; no registry download required).
- `npm run typecheck`: pass.
- `npm run test`: pass.
- `npm run build`: pass.
