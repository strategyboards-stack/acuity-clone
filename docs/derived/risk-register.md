# Risk Register

## RISK-RPT-001
- **Risk**: Source docs do not provide full numeric REQ-ID mapping for reports.
- **Impact**: Traceability drift if later phases expect canonical `REQ-00X` references.
- **Mitigation**: Introduced explicit derived IDs (`REQ-RPT-001..008`) in `req-index.md`; reconcile if canonical matrix is introduced.

## RISK-RPT-002
- **Risk**: Report data currently seeded from foundational in-memory dataset.
- **Impact**: Foundation behavior validated, but production analytics/aggregation backend not yet wired.
- **Mitigation**: Typed contracts and dataset summary model added to enable API integration in future phases without route shape churn.

## RISK-RPT-003
- **Risk**: Mobile behavior for reports remains under-evidenced in source audit.
- **Impact**: Responsive affordances may require additional QA tuning in later phase.
- **Mitigation**: Current reports shell uses responsive-safe, stacked layout primitives and keeps empty-state tolerance explicit.
