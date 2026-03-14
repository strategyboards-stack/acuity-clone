# Requirement Index

## Phase 10B — Manage Users & Permissions Shell

- **REQ-024**: Manage Users must be implemented as a host-shell permissions/ownership surface, not a scheduling-admin child page.
- **REQ-025**: Manage Users access gating must evaluate role + plan + verification + dependency state on the server-aware path.
- **REQ-026**: Owner row and ownership-state foundation must exist, including transfer-ownership entrypoint foundation.
- **REQ-027**: Invite contributor foundation must support explicit invitation-state modeling.
- **REQ-028**: Invitation actions can be visible but verification-gated until verification state becomes `verified`.
- **REQ-029**: Manage Users must render distinct empty/locked/verification-required states with responsive parity.

## Notes
These REQ IDs are derived from the Part 11 baseline and Part 09 Manage Users shell evidence for this implementation slice.
