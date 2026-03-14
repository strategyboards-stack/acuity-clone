# Risk Register

## 2026-03-14 — Phase 7B open risks

1. **Under-evidenced plan matrix granularity**
   - Risk: Exact tier boundaries for each money product may vary in production.
   - Mitigation: Centralized plan mapping in `evaluateProductSellability` for easy adjustment.

2. **Processor state transition coverage**
   - Risk: Real post-connect processor states (e.g., re-auth detail messaging) are only partially evidenced.
   - Mitigation: Model supports explicit dependency states; UI messaging remains extensible.

3. **Operational views detail depth**
   - Risk: Orders/subscribers views may need richer dimensions (currency, taxation, status histories).
   - Mitigation: Implemented conservative summary view preserving appointment linkage boundary.
