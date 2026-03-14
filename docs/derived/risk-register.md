# Risk Register

## Active Risks

### R-INT-001 — Source REQ IDs are range-only, not line-item enumerated
- **Impact:** Potential mismatch with future requirement numbering.
- **Mitigation:** Added explicit Phase 9A mapping in `docs/derived/req-index.md`; keep mapping revisitable.

### R-INT-002 — Provider post-connect lifecycle is under-evidenced
- **Impact:** Disconnect/re-auth/error UX may require schema evolution.
- **Mitigation:** Preserved explicit provider state model (`connected`, `disconnected`, `action_required`, `reauth_required`, `error`, `never_connected`) and deferred live auth flows.

### R-INT-003 — External delivery behavior not implemented in this phase
- **Impact:** Webhooks and analytics are config-only for now.
- **Mitigation:** Adapter dispatch plan implemented over internal domain events; execution adapters remain extension points for later phases.
