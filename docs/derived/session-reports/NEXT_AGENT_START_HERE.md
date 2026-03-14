# NEXT_AGENT_START_HERE

## What just shipped
Phase 7B foundations for money surfaces are implemented and validated.

## Recommended next phase focus
- Phase 7C or adjacent UI/API surfaces that consume `@acuity/contracts` and `@acuity/money` foundations.
- Extend with persistence/API wiring while preserving host billing shell separation.

## Guardrails
- Keep appointment coupons separate from package/gift/subscription systems.
- Keep processor dependency gating server-aware.
- Do not collapse scheduling money surfaces into account billing shell.
