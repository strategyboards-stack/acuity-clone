# Risk Register

## Active risks

### R-4B-001: Repository currently contains bootstrap scaffolding rather than full product implementation
- Impact: Validation commands can pass while feature depth remains limited.
- Mitigation: Keep Phase 4B status explicit; avoid claiming next-phase completion.
- Owner: Engineering.

### R-4B-002: External registry policy changes may reintroduce install failures
- Impact: `pnpm install` may fail again in locked-down environments.
- Mitigation: Root `.npmrc` now sets explicit public npm registry; monitor for policy drift.
- Owner: Engineering/Platform.
