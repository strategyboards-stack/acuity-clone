# Risk Register

## Active Risks

### R-9B-01 — Provider post-connect lifecycle remains under-evidenced
- **Area:** Integrations / calendar sync
- **Description:** Real token-expiry, reconnect, and disconnect UX states are not validated in source evidence.
- **Current mitigation:** Explicit provider-state enum includes `action-required`, `reauth-required`, and `error`.
- **Next mitigation:** Validate live provider lifecycle in Phase 9C with controlled mock adapters.

### R-9B-02 — Outbound webhook execution not implemented in this phase
- **Area:** Webhooks
- **Description:** This phase includes registration and mapping contracts but not delivery transport/retry engine.
- **Current mitigation:** Event mapping and endpoint-state model are complete and tested.
- **Next mitigation:** Add queue + delivery worker + retries in a dedicated execution phase.

### R-9B-03 — Analytics/custom integration execution deferred
- **Area:** Analytics / custom code
- **Description:** Config contracts exist; runtime execution plumbing intentionally deferred.
- **Current mitigation:** Preserve config boundaries and capability gating.
- **Next mitigation:** Implement secure sanitization/rendering + admin preview safeguards.
