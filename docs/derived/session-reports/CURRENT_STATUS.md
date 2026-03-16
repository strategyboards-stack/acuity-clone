# CURRENT_STATUS

- **Phase:** 11A
- **Objective:** Mobile hardening + responsive parity across public booking, client self-service, and admin core.
- **State:** In progress; booking, admin calendar, and client now share one appointment source (`/api/appointments`) for create + read visibility.
- **Constraints honored:**
  - no separate mobile business logic
  - same routes and shared domain wiring
  - Phase 11A only (no phase advancement)
