# Risk Register

## Active risks

1. **REQ mapping granularity under-evidenced**
   - Risk: Part 11 names REQ-001..REQ-029 but does not include explicit per-ID text in repository.
   - Mitigation: Introduced conservative Phase 1 derived mapping in `docs/derived/req-index.md` and kept implementation to shell scope.

2. **Feature policy matrix still provisional**
   - Risk: Contributor-level and enterprise gating depth are under-evidenced in source.
   - Mitigation: Middleware is centralized and extensible with role/plan/trial/dependency/verification model.

3. **No live infrastructure bindings in phase 1**
   - Risk: Worker + API + DB are scaffolded without live Redis/Postgres runtime credentials.
   - Mitigation: Build/typecheck/tests validate code paths; operational env integration deferred to later phase hardening.
