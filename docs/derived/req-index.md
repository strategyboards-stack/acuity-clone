# Requirement Index (Derived)

This file maps source-of-truth requirements into implementation slices for this repository.

## Communications (DOM-09)

> Assumption: upstream source names REQ-001..REQ-029 but does not provide a published per-ID breakdown in this repository snapshot. We allocate conservative, traceable derived IDs for in-repo execution and keep them explicitly reversible.

- **REQ-020** — Client email foundation must support template-based communications for appointment lifecycle messages (excluding receipts/order emails for this slice).
- **REQ-021** — Reminder/follow-up foundation must exist and remain appointment-aggregate driven.
- **REQ-022** — SMS reminder surface must remain independently plan/dependency gated and separated from client email/admin alert logic.
- **REQ-023** — Admin alert foundation must be toggle/state based and distinct from client-facing message templates.
- **REQ-024** — Notification preference/state foundation and delivery log foundation must be present for auditable messaging orchestration.
- **REQ-025** — Communications surfaces must enforce server-aware gating based on role, plan, trial, dependency, and verification state.
