# Requirement Index

## Phase 10C — Account / Host Billing Shell

- **REQ-014-A**: Host/account billing shell must exist as a route family separated from scheduling-admin money routes.
- **REQ-014-B**: Billing overview shell must show trial/paid state context.
- **REQ-014-C**: Payment Information shell foundation must model payment-information completeness and billing-address completeness.
- **REQ-014-D**: Subscriptions shell foundation must include empty state.
- **REQ-014-E**: Site/account invoices shell foundation must include empty state.
- **REQ-014-F**: Trial-state / upgrade-state handling must be explicit and block live payment-method edits.
- **REQ-014-G**: Unsaved-changes guard foundation must exist for billing edits.
- **REQ-014-H**: Server-aware gating model must account for role, plan, trial, dependency, and verification state.

## Source Trace

- `docs/source/part-11-clone-spec.txt` (DOM-14, host-shell architecture rules)
- `docs/source/part-09-reports-users-billing.txt` (site/account billing shell findings)
- `docs/source/part-10-mobile-audit.txt` (trial/upgrade overlays and responsive parity)
