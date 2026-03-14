# Requirements Index (Derived)

## Source references
- `docs/source/part-11-clone-spec.txt` (primary)
- `docs/source/part-07-master-dossier.txt`
- `docs/source/part-08-integrations-sync.txt`
- `docs/source/part-09-reports-users-billing.txt`
- `docs/source/part-10-mobile-audit.txt`

## Phase mapping snapshot

> Note: Source documents state REQ-001..REQ-029 but do not include an explicit per-REQ matrix. This index establishes conservative traceability IDs for implementation sequencing.

### Phase 8B — Communications execution and advanced messaging surfaces
- **REQ-021**: SMS reminders foundation behavior with plan/dependency-aware lock states.
- **REQ-022**: Client communication execution pipeline for reminders and follow-ups with internal event scheduling.
- **REQ-023**: Receipts/order email foundation as separate channel and purpose from reminder email.
- **REQ-024**: Admin alert execution foundation with dedicated purpose/channel path.
- **REQ-025**: Communication history and send-status model with attempt logs, retries, and failed-send handling.
- **REQ-026**: Communication event separation by channel and purpose; no flattened transport model.
