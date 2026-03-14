# Decision Log

## 2026-03-14 — Phase 9B foundation implemented as contracts-first slice
- **Context:** Repository started with source research docs only and no app/package scaffolding.
- **Decision:** Implement Phase 9B as a production-grade contracts package (`@acuity/contracts`) with typed integration models, gating evaluator, and event-map adapter logic.
- **Rationale:** This preserves architecture boundaries from Part 08/11 while avoiding speculative provider OAuth execution and outbound delivery implementation.
- **Consequences:** Future API/UI layers can consume stable contracts and test-backed behavior without conflating one-way ICS and two-way sync.

## 2026-03-14 — Explicit separation between two-way sync and one-way ICS retained
- **Context:** Source docs explicitly prohibit treating ICS publication as two-way sync.
- **Decision:** Model two separate entities (`CalendarTwoWayConnection`, `CalendarIcsPublication`) and separate capability keys (`calendar-sync-two-way`, `calendar-sync-ics`).
- **Rationale:** Maintains product-correct data paths and avoids hidden availability side effects.
- **Consequences:** Calendar logic remains adapter-based and extensible for future provider-specific execution.
