# Risk Register

## Active Risks

### R-001 — Product implementation surfaces absent
- **Area**: Public scheduler, client self-service, admin features.
- **Impact**: High.
- **Likelihood**: High.
- **Status**: Open.
- **Mitigation**: Keep Phase 1 limited to toolchain stabilization and preserve docs for Phase 2+ delivery.

### R-002 — Environment-specific package-manager behavior drift
- **Area**: Corepack/pnpm behavior across runners.
- **Impact**: Medium.
- **Likelihood**: Medium.
- **Status**: Mitigated for current environment.
- **Mitigation**: Pinned package manager + local `.npmrc` guardrails.
