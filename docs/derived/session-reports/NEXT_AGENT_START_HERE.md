# NEXT_AGENT_START_HERE

## Where to start

1. Run validation suite:
   - `npm install --ignore-scripts`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
2. Review communications foundation implementation:
   - `packages/contracts/src/communications.ts`
   - `apps/api/src/communications/foundation.ts`
   - `apps/api/test/communications.foundation.test.js`

## Suggested next phase direction

- Add persistent repositories (DB-backed) for templates/preferences/delivery logs.
- Introduce provider adapters for email/SMS execution behind current domain boundaries.
- Extend reminder/follow-up processing into worker orchestration while preserving appointment-centric aggregate flow.
