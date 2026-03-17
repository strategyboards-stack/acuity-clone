# Risk Register

## R-011A-001 — Runtime app code availability in repository snapshot
- **Area:** Phase 11A implementation
- **Risk:** Previously missing app runtime code prevented direct implementation.
- **Impact:** High
- **Likelihood:** Resolved
- **Mitigation:** Implemented runnable app surfaces and completed current Phase 11A pass.
- **Owner:** Engineering
- **Status:** Closed

## R-011A-002 — Route naming mismatch between environments
- **Area:** Mobile manual QA kickoff
- **Risk:** Canonical first review route naming can differ by preview environment.
- **Impact:** Medium
- **Likelihood:** Medium
- **Mitigation:** For this pass, use `/admin/calendar`, `/booking/demo`, and `/client` as baseline re-check routes.
- **Owner:** QA + Web
- **Status:** Open (non-blocking)

## R-011A-003 — Under-evidenced mobile modules
- **Area:** Admin responsive parity expansion
- **Risk:** Scheduling Page, Integrations, and Reports mobile behavior remain less evidenced compared to core validated modules.
- **Impact:** Medium
- **Likelihood:** Medium
- **Mitigation:** Preserve routes/shell discoverability and continue explicit viewport checks across 390x844, 360x800, 375x667, 412x915, 430x932, 768x1024 in future passes.
- **Owner:** Product + QA
- **Status:** Open (non-blocking)
