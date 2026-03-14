# Requirement Index

This index normalizes REQ-001 through REQ-029 from the clone spec into implementation slices.

## Phase 7B — Money surfaces products and operations (in scope)

- **REQ-016**: Implement scheduling-level money products foundation for packages, gift certificates, and subscriptions with explicit domain entities and admin discoverability.
- **REQ-017**: Enforce processor-dependent sellability and locked-state behavior for money products beyond plan state.
- **REQ-018**: Keep appointment coupons separate from package/gift/subscription code systems.
- **REQ-019**: Implement orders and subscribers operational views under scheduling money surfaces with appointment-linked reporting support.
- **REQ-020**: Preserve shell separation between scheduling money surfaces and account/host billing shell.
- **REQ-026**: Ensure server-aware feature gating evaluates role + plan + trial + dependency + verification state.

## Adjacent dependencies (out of Phase 7B coding scope)

- REQ-021: Host billing shell implementation.
- REQ-022: Live processor-connected payment execution/refund flows.
- REQ-027: Mobile parity QA pass for non-390x844 viewports.
