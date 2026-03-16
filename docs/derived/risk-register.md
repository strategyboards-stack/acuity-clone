# Risk Register

## R-011A-001 — Missing runtime app code in current snapshot
- **Area:** Phase 11A implementation
- **Risk:** Responsive hardening cannot be directly coded/tested in this snapshot because no `apps/web` (or equivalent frontend source) exists.
- **Impact:** High
- **Likelihood:** High
- **Mitigation:** Prepared executable Phase 11A scope, acceptance criteria, viewport matrix, and checkpoint artifacts so coding can start immediately once app code is present.
- **Owner:** Engineering
- **Status:** Open

## R-011A-002 — Route naming mismatch between environments
- **Area:** Mobile manual QA kickoff
- **Risk:** Canonical first review route `/booking/:slug` may differ from local preview route naming.
- **Impact:** Medium
- **Likelihood:** Medium
- **Mitigation:** Use public scheduling route in preview equivalent if path alias differs; keep the same business surface.
- **Owner:** QA + Web
- **Status:** Open

## R-011A-003 — Under-evidenced mobile modules
- **Area:** Admin responsive parity
- **Risk:** Scheduling Page, Integrations, and Reports mobile behavior remain less evidenced compared to core validated modules.
- **Impact:** Medium
- **Likelihood:** Medium
- **Mitigation:** Preserve routes/shell discoverability and include explicit viewport checks across 390x844, 360x800, 375x667, 412x915, 430x932, 768x1024.
- **Owner:** Product + QA
- **Status:** Open
