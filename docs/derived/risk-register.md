# Risk Register

## Active Risks

### R-0001 Future dependency expansion may reintroduce registry/proxy instability
- **Status**: Open
- **Phase**: 3A
- **Impact**: Future install steps could fail once third-party dependencies are added.
- **Mitigation**: Keep package manager pinned, use explicit registry config, and validate install/typecheck/test/build in CI whenever dependencies are introduced.
