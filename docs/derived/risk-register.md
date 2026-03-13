# Risk Register

## 2026-03-13

1. **REQ mapping incompleteness risk**
   - Description: Source files reference REQ-001..REQ-029 but do not provide explicit per-REQ definitions in repository.
   - Mitigation: Logged conservative REQ mapping for Phase 2A in `req-index.md`; keep mapping editable as richer evidence is added.

2. **Gating model under-specification risk**
   - Description: Server-aware plan/trial/dependency/verification gating requirements exist, but detailed policy matrix is not present.
   - Mitigation: Kept API endpoints isolated under admin scheduling namespace and documented future policy guard insertion point.

3. **Availability edge behavior risk**
   - Description: Overlap/conflict semantics for rules/overrides/resources are partially evidenced only.
   - Mitigation: Added strict DTO/contract validation for ranges; deferred conflict solver to Phase 2B per scope guard.
