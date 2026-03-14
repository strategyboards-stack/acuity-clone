# Risk Register

## Open Risks (Phase 10C)

1. **Live provider execution not implemented**
   - Risk: Payment-method persistence/capture behavior could diverge once processor integrations are wired.
   - Mitigation: Kept explicit foundation-only messaging and disabled live execution paths.

2. **Unsaved-changes guard scope is browser-navigation baseline only**
   - Risk: SPA-level route-transition interception semantics may need deeper App Router integration.
   - Mitigation: Added `beforeunload` guard foundation and documented extension point.

3. **Paid-state subscription/invoice lifecycle data is under-evidenced**
   - Risk: Listing/detail behavior for non-empty billing records may require later refinement.
   - Mitigation: Kept conservative empty-state-first shells with explicit placeholders.
