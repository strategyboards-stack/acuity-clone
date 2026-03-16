# NEXT_AGENT_START_HERE

## Phase 11A continuation checklist
1. Apply responsive hardening directly to existing shared route/component code (no mobile business-logic forks).
2. Validate all eight scope items in `docs/derived/req-index.md`.
3. Run viewport matrix checks at:
   - 390x844
   - 360x800
   - 375x667
   - 412x915
   - 430x932
   - 768x1024
4. Confirm admin calendar behavior remains intact.
5. Keep preview environment usable for manual review.

## First route for mobile manual review
Open the public scheduling page first at:
- `/booking/:slug`

Use the environment’s seeded slug value for `:slug`.
