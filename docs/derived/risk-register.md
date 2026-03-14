# Risk Register

## Active Risks

### R-010A-001 — Registry/proxy variability
- **Description**: External npm registry/proxy variability can still impact install speed or success.
- **Scope**: Bootstrap/install only.
- **Mitigation**: Commit `packageManager` pinning and retry settings in `.npmrc`; keep dependency graph minimal during Phase 10A.
- **Status**: Mitigated for current run.
