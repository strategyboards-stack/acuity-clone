# Requirement Index (Derived)

## Phase mapping

- **Phase 6A (prior):** CRM list/filter/detail foundations.
- **Phase 6B (current):** CRM actions and operations.

## Phase 6B REQ IDs in scope

- **REQ-CRM-006B-01** — Admin can ban a client from CRM detail surfaces.
- **REQ-CRM-006B-02** — Admin can unban a previously banned client.
- **REQ-CRM-006B-03** — Admin can delete a client with explicit destructive confirmation.
- **REQ-CRM-006B-04** — CRM supports client detail export foundation (single-record CSV).
- **REQ-CRM-006B-05** — CRM supports import/export foundation for client list operations.
- **REQ-CRM-006B-06** — Invalid import rows are reported without aborting valid-row ingest.
- **REQ-CRM-006B-07** — CRM action-state lifecycle is explicit (idle/running/success/error).
- **REQ-CRM-006B-08** — CRM operations generate audit/state-transition records.

## Cross-cutting constraints for this slice

- Appointment remains central aggregate boundary and is not re-homed into CRM-only models.
- CRM admin operations remain separated from client/public booking flows.
- No reports implementation in this phase.
- No Manage Users implementation in this phase.
