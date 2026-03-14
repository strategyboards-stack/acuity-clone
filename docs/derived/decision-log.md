# Decision Log

## 2026-03-14 — Phase 9A scope anchor and conservative REQ mapping

- Established a repository-local requirement map for `REQ-020..REQ-028` to unblock implementation because source text names REQ ranges but does not enumerate each requirement in detail.
- Implemented integration foundation as domain contracts + API service layer only, without taking ownership of booking logic.
- Modeled two-way sync providers and one-way ICS publication as separate entities/directions and preserved non-equivalence in code and tests.
- Added server-side gate context requiring role, plan, trial state, dependency state, and verification state.

### Consequences

- Future phases can extend connection/auth flows without changing Phase 9A boundaries.
- This baseline intentionally avoids live outbound webhook sending, real analytics provider execution, and real provider OAuth flows.
