# Risk Register

## Open Risks
- RISK-3A-001: Source docs declare REQ-001..REQ-029 but do not provide explicit per-ID text mapping; this phase uses a derived REQ index for traceability.
  - Impact: Future phases may need remapping if canonical per-ID matrix is introduced.
  - Mitigation: Keep phase-level acceptance criteria and commit scope tightly tied to derived REQ index.

- RISK-3A-002: Slot generation uses deterministic local seed data rather than a full availability engine.
  - Impact: Not yet suitable for real-time capacity/resource constraints.
  - Mitigation: Treat as phase foundation and replace with availability subsystem integration in later phases.
