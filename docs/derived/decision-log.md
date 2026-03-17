# Decision Log

## 2026-03-17 — Post-11A mobile parity pass foundation
- Re-anchored on Part 11 + Part 10 evidence for remaining non-blocking mobile parity surfaces: Scheduling Page, Integrations, Reports.
- Implemented responsive parity on shared existing route model without creating separate mobile business logic.
- Preserved shell-level separation statement for Manage Users/Billing; did not flatten these surfaces into scheduling pages.

## 2026-03-17 — Regression repair for core appointment loop
- Replaced shell-like regressions on `/admin/calendar`, `/booking/demo`, and `/client` with interactive stateful flows.
- Centralized shared appointment/block-off state in a local store so booking, calendar operations, and client self-service remain connected.
