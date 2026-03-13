# Decision Log

## 2026-03-13 — Phase 3B bootstrap in empty repository
- Context: Repository contained only source documents and no runnable application code.
- Decision: Scaffolded a minimal monorepo-compatible repository shape and implemented a dependency-light runnable web slice for Phase 3B public booking flow.
- Rationale: Network restrictions blocked package registry access for framework installation; implementation was adjusted to keep Phase 3B scope deliverable and fully validated in this environment.
- Scope control: Implemented public booking form, recurring modal behavior, confirmation page, and edit/reschedule/cancel entry routes only.
- Assumption: Private/direct-link behavior is enforced by appointment-type visibility gate with `?direct=1` query flag for this phase.
