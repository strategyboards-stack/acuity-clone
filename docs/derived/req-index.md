# Requirement Index

## Phase 11A — Mobile hardening and responsive parity

> Source priority used: Part 11 clone spec + Part 10 mobile audit.

### In-scope requirement mapping
- **REQ-011A-01**: Responsive parity for public booking.
- **REQ-011A-02**: Responsive parity for client self-service.
- **REQ-011A-03**: Responsive parity for already-implemented admin core surfaces.
- **REQ-011A-04**: Mobile navigation/menu behavior for admin surfaces (hamburger/collapsed discoverability).
- **REQ-011A-05**: Mobile-safe form layouts (touch-friendly and standard inputs).
- **REQ-011A-06**: Sticky or recoverable primary action patterns on mobile forms.
- **REQ-011A-07**: Modal scroll containment and predictable close/back behavior.
- **REQ-011A-08**: Viewport hardening matrix: 390x844, 360x800, 375x667, 412x915, 430x932, 768x1024.

### Guardrails (non-negotiable)
- Shared routes/entities/permissions with desktop (no separate mobile business logic).
- Preserve working admin calendar slice.
- Keep preview usable for manual review.
- Do not reopen prior phase review loops.
