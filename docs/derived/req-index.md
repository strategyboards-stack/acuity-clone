# Acuity Clone Authoritative Requirement Trace Matrix

Last updated: 2026-03-13
Primary source precedence: Part 11 > Part 07 > Part 08 > Part 09 > Part 10.

## Source ingestion verification

- Verified authoritative source files exist in current repository state:
  - `docs/source/part-11-clone-spec.txt`
  - `docs/source/part-07-master-dossier.txt`
  - `docs/source/part-08-integrations-sync.txt`
  - `docs/source/part-09-reports-users-billing.txt`
  - `docs/source/part-10-mobile-audit.txt`
- Full manual parse completed for all five documents before deriving requirements.

## Status note

This file replaces bootstrap/blocked planning by mapping clone requirements to explicit source evidence.
No product behavior has been invented beyond source text. Any non-explicit detail is tracked as assumption/risk in decision/risk logs.

---

## REQ matrix grouped by domain

### DOM-01 Public Scheduler

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-001 | Public scheduling flow must support service/date-time selection, booking form, and confirmation with edit/reschedule/cancel entry points. | Part 11 domain map + navigation tree; Part 07 public booking findings; Part 10 public mobile findings. |
| REQ-002 | Single-service configuration may deep-link directly to Date & Time; multi-service supports catalog-first path. | Part 11 core business rules; Part 07 public booking findings. |
| REQ-003 | Recurring booking must remain a separate modal branch from standard booking path. | Part 11 core business rules; Part 07 public booking findings. |
| REQ-004 | Private appointment types must be hidden from public catalog and accessible only by direct link. | Part 11 core business rules; Part 07 appointment type privacy findings. |

### DOM-02 Client Self-Service

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-005 | Client auth must include signup/login/reset; self-service includes appointments and manage codes surfaces. | Part 11 role matrix + navigation; Part 07 client findings; Part 10 client mobile findings. |
| REQ-006 | Confirmation page is the primary self-service hub for Edit Info, Reschedule, Cancel. | Part 11 core business rules; Part 07 public+client findings; Part 10 confirmation action findings. |

### DOM-03 Admin Calendar Ops

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-007 | Admin calendar must provide dashboard and week/day/month calendar views, detail panel, manual appointment creation. | Part 11 admin domain map; Part 07 admin calendar findings. |
| REQ-008 | Cancel/no-show and block-off-time operations must exist as first-class appointment operations. | Part 07 cancel + block off findings; Part 11 event model includes appointment.no_show and block.created. |

### DOM-04 Availability Engine

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-009 | Availability computation must combine weekly hours, overrides, global scheduling limits, and resource constraints. | Part 11 critical/core rules; Part 07 availability findings. |
| REQ-010 | Global scheduling limits must affect booking and self-service windows (reschedule/cancel/edit constraints). | Part 11 core business rules; Part 07 + Part 10 references to limits and self-service behavior. |

### DOM-05 Clients CRM

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-011 | Clients CRM must include list/search/filter/add/edit/notes/ban-delete/print/import-export with appointments context linkage. | Part 11 domain map; Part 07 clients findings. |

### DOM-06 Scheduling Page & Distribution

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-012 | Scheduling Page must include preview, styles/settings, direct links, embed code, and booking button/bar distribution surfaces. | Part 11 domain+navigation map; Part 07 scheduling page findings. |

### DOM-07 Service Catalog & Forms

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-013 | Appointment Types editor must own duration/pricing/visibility/forms/resources/integration assignments. | Part 11 domain map + business rules; Part 07 service catalog findings. |
| REQ-014 | Add-ons are separate entities with client-facing vs admin-only visibility; admin-only add-ons must not appear in self-booking flow. | Part 11 core rules; Part 07 add-on findings. |
| REQ-015 | Intake forms catalog must support internal-use forms that are never shown in public booking; includes terms/SOAP form types. | Part 11 core rules + domain map; Part 07 forms findings. |
| REQ-016 | Appointment coupons are separate from package/gift/subscription money instruments; blank coupon expiration is non-expiring. | Part 11 core business rules; Part 07 service catalog/money rules. |

### DOM-08 Money Surfaces

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-017 | Payment Settings + payment-at-booking, packages/gifts/subscriptions, orders/subscribers, and scheduling invoices are distinct scheduling-level money surfaces. | Part 11 domain map; Part 07 money findings; Part 09 layer-1 billing distinction. |
| REQ-018 | Money operations must enforce both plan gating and dependency gating (e.g., active processor required for subscriptions/invoice collection). | Part 11 plan gating + critical rules; Part 09 monetization findings and dependency examples. |

### DOM-09 Communications

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-019 | Communications must be implemented as three systems: client email templates, plan-gated SMS reminders, toggle-based admin alerts. | Part 11 communications split; Part 07 Part 7 addendum; Part 10 mobile admin reachability. |

### DOM-10 Integrations & Developer Surface

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-020 | Integrations must be adapter-driven and event-subscriber based; integrations cannot own booking core logic. | Part 11 critical rules; Part 08 architecture rules and coding guidance. |
| REQ-021 | Integrations inventory must preserve analytics, workflow bridges, webhooks/API, and developer custom surfaces (sidebar/conversion tracking). | Part 11 integrations summary; Part 08 primary surfaces/inventory. |
| REQ-022 | Provider connection state model must explicitly handle connected/disconnected/action-required/re-auth-required/error/never-connected. | Part 11 integration state requirement; Part 08 provider state recommendations. |

### DOM-11 Calendar Sync

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-023 | Two-way calendar sync (Cronofy mediated providers) and one-way ICS publication must be separate modules with different capabilities. | Part 11 critical rules; Part 08 executive + rules + sync inventory. |
| REQ-024 | External busy events from two-way sync must block availability via explicit blocker mapping; one-way publication must not block availability. | Part 11 critical rule #7 and sync distinction; Part 08 one-way behavior definition. |

### DOM-12 Reports

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-025 | Reports module must include Appointments, Revenue, Users, Intake Forms, Tips, Import/Export tabs with shared filter pattern and valid empty states. | Part 11 domain map; Part 09 reports inventory + shared behavior. |
| REQ-026 | Intake Forms report requires explicit question selection and Show action before data appears. | Part 09 tab-specific findings + business rule. |

### DOM-13 Permissions & User Management

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-027 | Manage Users must remain a separate Permissions & Ownership shell (owner row, transfer ownership, invite contributor entrypoint), not a normal scheduling tab. | Part 11 critical rules and navigation; Part 09 manage users findings and conservative rule. |

### DOM-14 Account Billing Shell

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-028 | Site/account billing shell (payment information, subscriptions, site invoices) must remain architecturally separate from scheduling-level invoices/payments. | Part 11 domain map + critical rules; Part 09 two-layer billing edge findings. |

### DOM-15 Mobile Web Parity + Cross-Cutting Gating

| REQ ID | Requirement (authoritative) | Evidence |
|---|---|---|
| REQ-029 | Mobile must be responsive parity using the same routes/entities/permissions as desktop; feature gating must evaluate role + plan + trial + dependency + verification state on backend-capable logic. | Part 11 critical/cross-cutting rules; Part 10 critical implications; Part 09 gating examples. |

---

## Explicit dependency extraction (source-derived)

### System dependencies
- Payment processor connection state is required for meaningful subscriptions and invoice collection behavior.
- Cronofy mediation is required for two-way calendar provider sync.
- External providers (Google/iCloud/Outlook families, Zapier/Zoho, analytics endpoints) are adapter dependencies, not booking-core dependencies.
- Verification dependency can gate contributor invites even when entrypoint is visible.

### Product dependencies by area
- Money surfaces depend on both plan entitlement and processor dependency state.
- Invite contributor depends on verification state.
- Developer surfaces (API credentials/custom code) depend on premium-tier entitlement.
- Reports depend on data availability but must still render empty-state views.

## Explicit gating rule extraction (source-derived)

- Gate evaluation dimensions (all required): role, plan, trial state, dependency state, verification state.
- SMS reminder editing is plan-gated (paid tiers).
- Packages/gifts/subscriptions are plan-gated and processor-dependent.
- API credentials and advanced developer customizations are premium/legacy Powerhouse gated.
- Trial billing states display upgrade CTAs and limited capability.

## Explicit assumptions (kept separate from confirmed requirements)

- Contributor granular RBAC matrix is not fully evidenced; model as extensible placeholders.
- Enterprise-only operational surfaces are open-boundary and should not be fabricated.
- Post-connect integration state transitions are only partially evidenced; preserve explicit state machine extension points.
- Mobile coupon-field discrepancy is unresolved intent; implement as explicit tracked product decision.

## Explicit risk extraction summary

- Risk of over-modeling under-evidenced contributor/enterprise behavior.
- Risk of conflating one-way ICS with two-way sync.
- Risk of collapsing host-shell surfaces into scheduling routes.
- Risk of gating only in frontend and bypassing dependency/verification checks.
- Risk of mobile divergence in discoverability and form completion ergonomics.
