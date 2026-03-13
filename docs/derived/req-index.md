# REQ Index

## Phase 3B — Public booking flow completion

- REQ-PUB-BOOK-FORM: Public booking form captures required identity/contact fields and appointment selection with validation.
- REQ-PUB-RECURRING-MODAL: Recurring booking is a modal branch with explicit frequency selection.
- REQ-PUB-CONFIRMATION: Confirmation page renders newly created appointment details.
- REQ-PUB-POSTBOOK-ACTIONS: Confirmation provides post-book action foundation links.
- REQ-PUB-EDIT-ENTRY: Edit info entry route exists and resolves appointment context.
- REQ-PUB-RESCHEDULE-ENTRY: Reschedule entry route exists and resolves appointment context.
- REQ-PUB-CANCEL-ENTRY: Cancel entry route exists and resolves appointment context.

## Dependency requirements preserved
- REQ-P2B-VISIBILITY: Public/private visibility rules preserved.
- REQ-P3A-DIRECT-LINK: Private types allowed through direct-link gate only.
- REQ-ARCH-APPOINTMENT-AGGREGATE: Appointment remains central aggregate for post-book actions.
