# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-09-18

### Added

- **Project presets ("Starting points")** — `--preset blog | dashboard |
landing-page`, an interactive "Starting point" question at the top of the
  create flow, and a global-config `preset` key. A preset bundles framework,
  language, styling and extras into one choice; the package manager stays
  machine-specific and is auto-detected. Precedence is documented and tested:
  flags > preset > global config > prompts. Adding a preset is pure data in
  `src/config/presets.ts` (zod-validated, registry-checked at startup).
- `frontend-starter templates` now lists the presets.
- The `create` flags table in this README now lists `vue` (documentation
  follow-up from 0.3.0).

## [0.3.1] - 2026-09-18

### Changed

- `create` flag handling is now table-driven (`src/commands/create-flags.ts`):
  one `CREATE_FLAG_SPECS` table drives both commander declarations and the
  typed `CreateFlags` mapping, with accessors keyed by the camelCase fields of
  `CreateFlags`. Reading a flag under its kebab string no longer compiles,
  which eliminates the bug class behind the v0.1.0 `--package-manager` and
  v0.2.0 `--dry-run` misreads.
- `src/index.ts` exports `buildCli()`, so round-trip tests drive the real
  declarations; 9 new unit tests verify every spec flag end-to-end, including
  tri-state semantics (absent = undefined, not false).
- Boolean flags are strictly tri-state: an omitted `--eslint` no longer
  force-disables ESLint, so global-config defaults and prompts keep working
  (regression-caught during this refactor by the new tests).

## [0.3.0] - 2026-09-18

### Added

- **Vue 3 (Vite) framework** — the first template added through the registry
  extension point documented in CONTRIBUTING.md. TypeScript (with `vue-tsc`
  type-checked builds) and JavaScript slices; Tailwind v4, CSS Modules (idiomatic
  `<style module>` SFC) and Plain CSS styling; `eslint-plugin-vue` flat config.
- Shared framework label map (`src/templates/shared/labels.ts`) so new
  frameworks need exactly one label entry across prompts, `init` and
  `templates`.

### Fixed

- **Tailwind was never compiled in generated Vite/Next projects.** The
  stylesheet imported Tailwind but the Vite plugin (react/vue) or PostCSS
  config (next) was missing, so builds passed while shipping unstyled apps.
  All Tailwind templates now emit the correct wiring, verified by the compiled
  CSS bundle size in real builds and by new regression tests.
- `--framework` validation now derives accepted values from `FRAMEWORKS` and
  no longer hardcodes the framework list in the create command.

## [0.2.0] - 2026-09-18

### Added

- `--dry-run` flag for `create`: renders the complete file tree and the
  `package.json` that would be generated without writing anything. In preview
  mode an existing non-empty target directory downgrades the hard error to a
  warning.
- Dependabot configuration (npm + GitHub Actions, weekly, grouped dev bumps).
- Integration tests for the dry-run preview and the git initialization flow
  (initial commit on `main` with deterministic test identity).
- The Node.js version floor (>= 20.19) is now enforced at startup with a
  readable upgrade message instead of failing deep inside dependency imports.

### Fixed

- `doctor` and `templates` output now respects `--quiet`.
- `bun` on Windows no longer runs through `cmd.exe` (it is a native `.exe`, not
  a `.cmd` shim), restoring verbatim argument passing.
- Removed an unreachable error-rendering branch in the CLI error handler.
- Removed dead exports (`pickPackageManager`, `GeneratedFile`,
  `TemplatePart.removals`, `ExecOptions`).

## [0.1.0] - 2026-09-18

### Added

- `create` command with interactive and fully non-interactive flows:
  React (Vite) and Next.js (App Router) frameworks, TypeScript and JavaScript,
  Tailwind CSS v4 / CSS Modules / Plain CSS styling, ESLint and Prettier
  overlays.
- Package-manager detection (pnpm, npm, yarn, bun) with configurable order,
  install hints for missing managers, and no silent installs.
- Git initialization with a readable failure path for unconfigured identity.
- `doctor` command reporting OS, architecture, Node, package managers and Git,
  distinguishing required from optional tooling.
- `init` command saving personal defaults to a cross-platform global config
  (`config.json`), with strict validation and no secret storage.
- `templates` command (alias `list`) enumerating supported combinations.
- Non-destructive safety: existing-directory conflict flow (cancel / rename /
  overwrite with confirmation), `--force` for non-interactive overwrites,
  plain-file target detection, npm- and Windows-safe name validation.
- Exit-code contract: 0 success, 1 generation failure, 2 post-task failure
  (files remain usable), 130 user cancellation.
- 69 tests: unit coverage of validation, merging, composition and reporting,
  plus end-to-end integration runs of the built CLI.
- Cross-platform CI (Ubuntu, Windows, macOS × Node 20/22/24) and a
  provenance-enabled release workflow.
