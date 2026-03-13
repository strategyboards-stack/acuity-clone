# Risk Register

Last updated: 2026-03-13

| Risk ID | Area | Description | Impact | Likelihood | Mitigation | Source anchors |
|---|---|---|---|---|---|---|
| R-001 | Permissions/RBAC | Contributor role granularity is under-evidenced; risk of overfitting incorrect role matrix. | High | Medium | Implement extensible role model with conservative defaults; keep assumptions explicit until validated. | Part 11 under-evidenced list; Part 09 open gaps. |
| R-002 | Enterprise surface | Enterprise-only operational UI not directly validated; risk of inventing unavailable controls. | Medium | Medium | Exclude speculative enterprise UI from baseline; keep route/flag extension points only. | Part 11 under-evidenced list; Part 09 open gaps. |
| R-003 | Integrations sync semantics | Confusion between one-way ICS and two-way Cronofy sync could cause incorrect availability behavior. | High | Medium | Enforce separate modules and contracts for sync directionality and blocker mapping. | Part 11 critical rules; Part 08 executive + rules. |
| R-004 | Post-connect states | Real disconnect/re-auth/token-expiry flows are partially evidenced; risk of dead-end states. | Medium | High | Model explicit connection states and recovery actions; mark advanced transitions as TODO-validated. | Part 08 open gaps + recommended states. |
| R-005 | Payments realism | Live processor-connected payment/invoice/subscription behavior not fully validated. | High | Medium | Gate money actions on processor dependency state; keep processor operations adapter-bound. | Part 11 under-evidenced list; Part 07/09 dependency findings. |
| R-006 | Architecture drift | Risk of flattening Manage Users/Billing into scheduling admin routes. | High | Medium | Enforce shell-level route boundaries in Phase 1 file plan and acceptance checks. | Part 11 critical rules; Part 09 manage users + billing edge. |
| R-007 | Mobile parity | Mobile discoverability/form ergonomics issues could reduce completion and admin usability. | Medium | High | Reuse same business logic/routes and apply responsive UX fixes (nav discoverability, sticky save, input ergonomics). | Part 10 mobile frictions + implications. |
| R-008 | Coupon mobile divergence | Missing coupon field on observed mobile booking is ambiguous (intentional vs defect). | Medium | Medium | Track as explicit product decision with acceptance test expectation before implementation lock. | Part 10 MOB-01. |
| R-009 | Reporting completeness | Report exports and populated datasets partially evidenced; risk of incorrect schema assumptions. | Medium | Medium | Build empty-state-safe report contracts first; defer detailed export payload semantics behind explicit assumptions. | Part 09 reports findings + open gaps. |
| R-010 | Classes lifecycle | Group class/class-series lifecycle under-evidenced; risk of incorrect scheduling model. | Medium | Medium | Keep class support as flagged extension area outside Phase 1 core acceptance. | Part 11 under-evidenced list; Part 07 classes gap. |
