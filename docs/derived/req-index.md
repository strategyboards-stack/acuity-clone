# Requirement Index

## Phase 4A — Client Self-Service Foundation

| REQ ID | Requirement | Status | Evidence |
|---|---|---|---|
| REQ-002 | Client self-service foundation route shells exist for authenticated client flows. | Implemented | `apps/web/src/client-self-service.ts` route registry |
| REQ-006 | Confirmation-page self-service actions include edit, reschedule, and cancel pathways. | Implemented | `apps/web/src/client-self-service.ts` action selector |
| REQ-015 | Mobile parity uses shared routes/business logic (no separate mobile domain model). | Implemented (foundation) | `mobileParity: true` on all Phase 4A self-service route definitions |
| REQ-028 | Monorepo/tooling baseline supports install/typecheck/test/build validation. | Implemented | Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `bin/pnpm` |
