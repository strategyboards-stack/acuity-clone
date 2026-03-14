# Decision Log

## 2026-03-14 — Phase 7A money foundation modeled as contracts + API domain service

- Implemented scheduling money-surface foundation as shared contracts (`@acuity/contracts`) plus API service (`MoneyFoundationService`) to keep server-aware gating authoritative.
- Explicitly modeled dependency-state gating with plan, verification, provider presence, and provider connection state.
- Kept invoice draft semantics appointment-centered (`appointmentId`) to preserve appointment aggregate boundary and avoid coupling to host billing shell.
- Deferred packages/gifts/subscriptions, orders/subscribers, and live processor SDK behavior to later phases per scope guardrails.
