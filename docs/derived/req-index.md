# Requirement Index

## Source mapping
Primary source order follows AGENTS baseline: Part 11, Part 07, Part 08, Part 09, Part 10.

## Phase mapping

- **Phase 5B — Admin calendar actions**
  - **REQ-010**: Admin can block off time from calendar operations and persist it as a calendar-blocking appointment aggregate event.
  - **REQ-011**: Admin can cancel an appointment from appointment detail with reason capture and optional client email signal.
  - **REQ-012**: Admin can mark appointment no-show from appointment detail and persist state transition.
  - **REQ-013**: Admin can reschedule appointment from appointment detail and persist temporal state transition.
  - **REQ-014**: Destructive admin actions must require confirmation and server-side auth/verification gating.
  - **REQ-015**: Appointment detail side panel must receive action completion payloads suitable for UI confirmations.
  - **REQ-016**: Admin actions must append auditable events tied to the same appointment aggregate boundary.

## Notes
The Part 11 source enumerates REQ-001 to REQ-029 but does not provide numbered line-by-line definitions in-repo. This index assigns stable IDs for implementation slices and logs the normalization in decision-log and risk-register.
