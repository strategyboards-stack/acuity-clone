# Decision Log

## 2026-03-13 — Authoritative source ingestion completed

### Context
Previous planning artifacts were absent/bootstrap-level and not yet fully traceable to current authoritative source files.

### Decision
Adopted `docs/source/part-11-clone-spec.txt` as primary baseline, with Parts 07–10 as ordered supplements, and generated a requirement trace matrix (`REQ-001`..`REQ-029`) grouped by domain in `docs/derived/req-index.md`.

### Rationale
Part 11 explicitly defines clone-ready baseline and priority ordering. Supplemental parts add implementation detail for integrations/sync, reports/users/billing, and mobile deltas.

### Consequences
- Planning is now source-derived and non-bootstrap.
- All assumptions remain explicit and separated from confirmed requirements.
- Under-evidenced zones remain open risk, not silently implemented behavior.

---

## 2026-03-13 — Architecture boundary preservation for host-shell areas

### Decision
Maintain strict architectural separation between:
1. Scheduling admin surfaces (calendar/availability/CRM/catalog/money ops), and
2. Host-shell account surfaces (Manage Users permissions shell + site billing shell).

### Rationale
Source documents repeatedly assert this separation as a critical rule and anti-flattening requirement.

### Consequences
- Phase 1 planning includes separate route/shell scaffolds for Manage Users and Billing.
- No merging of ownership/billing records into standard scheduling page models.

---

## 2026-03-13 — Conservative normalization for under-evidenced features

### Decision
For under-evidenced areas (granular RBAC, enterprise operations, post-connect integration transitions, full class lifecycle, live processor/refund behavior), preserve extension points and explicit states but avoid speculative UX/logic.

### Rationale
Authoritative sources prohibit inventing behavior when evidence is incomplete.

### Consequences
- Risks logged in `docs/derived/risk-register.md`.
- Phase 1 acceptance criteria include documentation and testability of assumptions/flags.
