# Risk Register

## Active Risks

### RISK-006A-01 — Canonical REQ ID mapping is under-specified in source text
- **Evidence**: Part 11 states REQ-001..REQ-029 exist but does not include the enumerated map in current repository documents.
- **Impact**: Potential drift between local implementation IDs and future canonical requirement labels.
- **Mitigation**: Maintained explicit local REQ map in `docs/derived/req-index.md` and flagged for reconciliation once canonical list is provided.

### RISK-006A-02 — CRM persistence currently in-memory only
- **Evidence**: Foundation phase implemented with seed data to establish surface behavior quickly.
- **Impact**: Data resets on reload; no multi-user consistency.
- **Mitigation**: Keep domain functions strongly typed/validated to ease transition to API + DB in subsequent phase.

### RISK-006A-03 — Role gate uses request header contract in local scaffold
- **Evidence**: No auth provider existed in repository baseline.
- **Impact**: Header contract is not production auth by itself.
- **Mitigation**: Gate is server-side and intentionally isolated for replacement with real auth/session middleware.
