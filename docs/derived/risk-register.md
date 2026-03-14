# Risk Register

## R-001 Missing historical Phase 4A code snapshot
- Risk: The repository history available in this workspace contains only documentation commits, so exact prior implementation cannot be restored byte-for-byte.
- Impact: Reconstructed implementation may differ from previously attempted Phase 4A branch internals.
- Mitigation: Implement conservative extensible foundation aligned to Part 11 + Part 07/10 evidence; maintain explicit phase scope and validate with full monorepo checks.

## R-002 Under-evidenced authenticated non-empty client states
- Risk: Source evidence for populated client appointment history and manage-codes edge states is partial.
- Impact: UI/state behavior might need adjustments in later phases.
- Mitigation: Preserve route shells and domain utility layer for extension in Phase 4B+.

## R-003 Local pnpm shim divergence from production toolchain
- Risk: Local command shim differs from a real pnpm binary and may mask package-manager-specific behavior.
- Impact: Future dependency resolution behavior could differ when networked pnpm is available.
- Mitigation: Keep workspace dependency-free for Phase 4A recovery; replace shim with real pnpm in next network-enabled environment validation pass.
