# Decision Log

## 2026-03-14 — Phase 7B foundation in contracts + money domain package

- **Decision**: Implemented Phase 7B as domain and contract foundations in `packages/contracts` and `packages/money` rather than introducing incomplete UI routes.
- **Why**: Repository currently contains source docs only; foundation-first implementation enables safe server-aware gating, sellability rules, and money operations logic with tests.
- **Implications**:
  - Money products now have explicit shared contracts.
  - Processor dependency is enforced in code, not frontend-only.
  - Appointment coupons are explicitly separated from package/gift/subscription code systems.
  - Orders/subscribers operational summaries are implemented and test-covered.
- **Assumption**: REQ IDs for Phase 7B were normalized in `docs/derived/req-index.md` due absent prior derived index in repository state.
