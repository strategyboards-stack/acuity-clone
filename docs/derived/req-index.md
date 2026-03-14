# Requirement Index

## Phase 9B — Integrations and Sync Completion

| REQ ID | Requirement | Status | Evidence |
| --- | --- | --- | --- |
| REQ-9B-01 | API credentials completion model and contract. | Implemented | `packages/contracts/src/integrations/types.ts` |
| REQ-9B-02 | Webhook event registration and endpoint-state completion. | Implemented | `types.ts`, `event-map.ts` |
| REQ-9B-03 | Analytics/custom integration config completion. | Implemented | `types.ts` |
| REQ-9B-04 | Custom Sidebar Integration configuration completion. | Implemented | `types.ts` |
| REQ-9B-05 | Custom Conversion Tracking configuration completion. | Implemented | `types.ts` |
| REQ-9B-06 | Calendar sync provider inventory completion. | Implemented | `types.ts` |
| REQ-9B-07 | Explicit provider connection-state handling. | Implemented | `types.ts` |
| REQ-9B-08 | One-way ICS publication foundation/completion. | Implemented | `types.ts` |
| REQ-9B-09 | Sync/admin locked states and dependency-state handling. | Implemented | `gating.ts`, `gating.test.ts` |
| REQ-9B-10 | Explicit separation of two-way sync vs one-way ICS publication. | Implemented | `types.ts`, `gating.test.ts` |
| REQ-9B-11 | Adapter-level event mapping completion for integrations. | Implemented | `event-map.ts`, `event-map.test.ts` |
