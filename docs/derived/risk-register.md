# Risk Register (Derived)

## Active risks

### R-CRM-IMP-01 — Exact import/export format parity not fully evidenced
- **Area:** Clients CRM import/export
- **Evidence gap:** Source documents explicitly mark exact populated export/import payload behavior as open.
- **Current mitigation:** Implemented conservative CSV foundation with explicit headers and row-level validation errors.
- **Follow-up:** Validate against real Acuity populated exports and reconcile field parity/mapping.

### R-CRM-RBAC-01 — Granular contributor authorization matrix under-evidenced
- **Area:** Admin CRM action permissions
- **Evidence gap:** contributor granularity remains open in source evidence.
- **Current mitigation:** kept role/plan/dependency/verification gating boundary out of client/public flows and isolated CRM admin operations.
- **Follow-up:** integrate concrete RBAC matrix once permissions shell scope is implemented.
