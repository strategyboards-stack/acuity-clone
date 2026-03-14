# Requirement Index

## Phase 7A — Money surfaces foundation (in scope)

- **REQ-018**: Scheduling-level payment settings foundation must exist independently from host/account billing shell.
- **REQ-019**: Payment processor connection state must be explicitly modeled (connected, disconnected, never-connected, action-required, reauth-required, error).
- **REQ-020**: Payment-at-booking policy must evaluate server-side dependency state (plan, verification, processor state), not frontend flags alone.
- **REQ-021**: Scheduling invoices must share appointment aggregate identity and support collectable vs non-collectable dependency-state outcomes.
- **REQ-022**: Money-surface admin states must include empty/locked behavior for processor-missing vs processor-connected states.

## Out of scope for Phase 7A

- REQ money features for packages/gift certificates/subscriptions implementation flows.
- REQ money features for orders/subscribers implementation flows.
- Host-level account billing shell implementation.
- Live payment processor integrations and charge/refund execution.
