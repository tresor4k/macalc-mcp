# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [0.4.0] — 2026-07-03

### Changed
- **Curated core profile by default.** The wrapper now exposes 15 well-scoped tools instead of the full 446-tool catalog: 12 flagship calculators (French income tax & gross-to-net salary, US federal tax, UK income tax, Canadian federal tax, mortgage, compound interest, loan payment, percentage, generic VAT, BMI, TDEE) plus `list_bundles`, `get_bundle_tools` and the new `call_any_calculator` dispatcher. Nothing is lost: every hosted calculator remains reachable through the dispatcher, and `MACALC_MCP_FULL=1` restores the full catalog listing.
- Tool descriptions rewritten for clarity: purpose, when to (and not to) use each tool, parameter semantics matching the exact input schema, and behavioral notes (read-only, deterministic, estimates ≠ advice).
- Clearer error message when the hosted endpoint is unreachable (points to the status page).

### Added
- `call_any_calculator` — invoke any of the 446 hosted calculators by name (discover names via `list_bundles` → `get_bundle_tools`).
- MCP tool annotations on all core tools (`readOnlyHint`, `destructiveHint: false`, `idempotentHint`, `openWorldHint`).
- Smoke test suite (`npm test`): stdio spawn, initialize, core-profile checks, plus online reference-value calls when the endpoint is reachable.
- This changelog.

## [0.3.1] — 2026-04

### Changed
- Upstream tool descriptions now list return keys and bundle alternatives.

## [0.3.0] — 2026-04

### Added
- Prompts and resources forwarding; bundle meta-tools surfaced by the hosted server.

## [0.2.0] — 2026-04

### Changed
- Hosted endpoint restored after HTTP 410 middleware regression; wrapper hardened with lazy connect and graceful degradation.

## [0.1.0] — 2026-04-24

### Added
- Initial release: stdio proxy around the hosted macalc Streamable HTTP MCP server (`https://macalculatriceenligne.com/api/mcp`), Dockerfile, MIT license.
