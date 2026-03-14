# Risk Register

## Open Risks

### RISK-P6B-SNAPSHOT-01
- **Area:** Phase 6B CRM operations runtime validation
- **Risk:** No runnable app code exists in current repository snapshot, so CRM action/operation runtime behavior cannot be validated end-to-end.
- **Impact:** Functional certainty for Phase 6B behavior remains low despite successful bootstrap and command-level validation.
- **Mitigation in this run:** Completed install/typecheck/test/build checks with deterministic bootstrap scripts and recorded explicit smoke-skip rationale.
- **Next action (same phase):** Re-run `pnpm smoke:crm` once app surfaces are restored in repository.
