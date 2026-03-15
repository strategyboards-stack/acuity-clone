# Decision Log

## 2026-03-14 — Add local `/preview` demo shell
- Implemented a Next.js local preview shell because the repository had source specifications but no runnable application routes.
- Added deterministic local demo identities via query string (`?as=`) rather than real auth providers to keep bypass local-only and non-production.
- Represented unimplemented areas explicitly in preview classification instead of inventing behavior.
