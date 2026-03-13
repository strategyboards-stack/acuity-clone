# AGENTS.md

## Mission

Build a production-grade responsive web clone of Acuity Scheduling from the repository and source documents in this project.

This is **not** a “simple booking widget” project. It is a multi-surface scheduling platform with:
- public scheduler
- client self-service
- admin back office
- availability engine
- service catalog
- intake forms
- money surfaces
- communications
- integrations and calendar sync
- reports
- permissions shell
- account billing shell
- responsive mobile parity

You are expected to work as a principal product architect, staff-level full-stack engineer, QA lead, and release engineer.

---

## Source of truth priority

Use these files as the authoritative product baseline, in this exact order:

1. `docs/source/part-11-clone-spec.txt`
2. `docs/source/part-07-master-dossier.txt`
3. `docs/source/part-08-integrations-sync.txt`
4. `docs/source/part-09-reports-users-billing.txt`
5. `docs/source/part-10-mobile-audit.txt`

Older or duplicate materials are provenance only. If they conflict with the files above, the files above win.

If evidence is incomplete:
- do **not** invent arbitrary product behavior
- implement a conservative extensible version
- keep routes/shells/discoverability where appropriate
- log the assumption in `docs/derived/decision-log.md`
- log the risk in `docs/derived/risk-register.md`

---

## Product scope

### Core product surfaces
- Public scheduling page
- Client account / self-service
- Admin calendar operations
- Availability and resource management
- Service catalog and appointment types
- Add-ons, coupons, packages, gift certificates, subscriptions
- Intake forms and internal-use forms
- Email / SMS / admin alerts
- Integrations and developer surface
- Reports
- Permissions and ownership
- Billing / account shell
- Mobile-responsive parity

### Under-evidenced areas
Treat these as explicit open-risk areas, not as license to simplify or improvise:
- granular contributor RBAC
- enterprise-only operational UI
- live processor-connected payment behavior
- post-connect / disconnect / re-auth integration states
- full group class / class series lifecycle
- some mobile admin details
- native app scope

---

## Non-negotiable architectural rules

1. **Do not flatten Manage Users or Billing into ordinary scheduling pages.**
   These are shell-level account surfaces, not just more admin tabs.

2. **Do not model 1-way ICS publication as true 2-way sync.**
   They are different features with different data paths and expectations.

3. **Do not create separate business logic for mobile.**
   Mobile is responsive parity over the same domain model and permissions.

4. **Do not keep feature gating only in the frontend.**
   Gating must evaluate:
   - role
   - plan
   - trial state
   - dependency state
   - verification state

5. **Do not let integrations own booking logic.**
   Integrations are adapters over internal domain events.

6. **Appointment is the central aggregate.**
   Booking, self-service, CRM, notifications, invoices, and reports must share the same core appointment model.

7. **Do not silently omit under-evidenced zones.**
   Preserve extension points, route shells, flags, and documented assumptions.

8. **Repository-first execution only.**
   Work against the codebase, docs, tests, and Git history. Do not rely on desktop automation assumptions in product logic or documentation.

---

## Recommended technical stack

Unless the repository already clearly dictates another choice, use:

- Monorepo: `pnpm` + `turborepo`
- Web app: `Next.js 15` + `TypeScript` + App Router
- API app: `NestJS`
- Worker app: `BullMQ`-based worker service
- Database: `PostgreSQL`
- ORM: `Prisma`
- Cache/queue/locks: `Redis`
- Object storage: S3-compatible storage
- UI: Tailwind + accessible component primitives
- Testing:
  - unit/integration: Vitest or Jest
  - e2e: Playwright

---

## Mandatory repository structure

The repository must converge toward this structure:

- `/apps/web`
- `/apps/api`
- `/apps/worker`
- `/packages/db`
- `/packages/ui`
- `/packages/contracts`
- `/packages/config`
- `/packages/testing`
- `/docs/source`
- `/docs/derived`
- `/docs/derived/session-reports`
- `/prompts`

If the repo already contains partial scaffolding, normalize it rather than blindly replacing it. Log major restructuring decisions in `docs/derived/decision-log.md`.

---

## Required working files

These files must exist and remain up to date:

### Core derived docs
- `docs/derived/decision-log.md`
- `docs/derived/risk-register.md`
- `docs/derived/req-index.md`
- `docs/derived/progress.md`

### Session / handoff docs
- `docs/derived/session-reports/MASTER_PROGRESS_LOG.md`
- `docs/derived/session-reports/CURRENT_STATUS.md`
- `docs/derived/session-reports/NEXT_AGENT_START_HERE.md`
- `docs/derived/session-reports/screenshots/SCREENSHOT_INDEX.md`
- `docs/derived/session-reports/checkpoints/`

If they do not exist, create them.

---

## Execution model

### Golden rule
Do the work. Do not narrate obvious next steps instead of doing them.

### Before any coding milestone
You must first produce or verify:

1. exact REQ IDs in scope
2. dependencies
3. edge cases
4. exact file plan
5. acceptance criteria

Only then write code.

### If a phase plan already exists
Do not restart planning from scratch. Re-anchor on:
- current phase
- REQ IDs in scope
- exact file plan
- acceptance criteria
- current repo state

Then continue implementation.

---

## Delivery rules

### Always
- Generate complete files, not pseudocode
- Generate migrations when schema changes
- Generate DTOs/contracts/validation for new APIs
- Generate tests
- Update docs
- Maintain consistency with source-of-truth docs
- Preserve existing project conventions unless there is a documented reason to change them

### Never
- leave architecture half-decided
- skip migrations
- skip tests because “the next phase will fix it”
- move to the next phase while the current phase is red
- treat failing tests/builds as reasons to stop
- ask for permission to perform routine engineering work

---

## Debug loop policy

The following are **not blockers**:
- failing tests
- failing e2e tests
- failing typecheck
- failing build
- lint failures
- route/controller/service mismatches
- DTO or schema mismatches
- Prisma issues
- migration issues that can be fixed in code
- dependency/build-script approval steps
- pending patch review files
- missing endpoint implementations
- incorrect response shapes
- missing mocks/fixtures

### Required debug loop
If anything fails, do this without interruption:

1. capture failing command and output
2. inspect stack trace / assertion / diff
3. inspect affected files
4. identify root cause
5. fix root cause
6. rerun smallest relevant verification
7. rerun:
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
8. repeat until green or until a real external blocker appears

Do not stop to report ordinary engineering problems mid-loop.

---

## External blocker policy

You may stop only for real external blockers such as:
- MFA or login approval
- cloud/provider account access
- payment processor credentials
- email/SMS vendor credentials
- domain / DNS actions
- production deployment approval
- irreversible destructive actions
- secrets that only the owner can provide

If blocked, use this exact format:

```text
BLOCKER:
What is needed:
Why it is needed:
Exactly where I must click or paste:
What you will do immediately after I provide it: