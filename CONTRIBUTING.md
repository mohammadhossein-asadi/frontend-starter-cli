# Contributing to frontend-starter

Thanks for helping improve the tool! This guide covers the architecture and
the exact steps to extend it.

## Finding and claiming an issue

1. Pick an open issue labeled
   [good first issue](https://github.com/mohammadhossein-asadi/frontend-starter-cli/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
   — each one lists the files to touch and a definition of done.
2. **Claim it before you start:** comment `/take` on the issue. A bot assigns
   you automatically and confirms it — that's your signal to begin. (The
   claim matters: it prevents two people building the same thing.)
3. Work on a fork/branch, open a **draft PR early** with `Closes #<issue>` in
   the description so progress is visible.
4. Need to step away? No problem — comment `/release` and the bot unassigns
   you. If a claimed issue sees no activity for ~2 weeks, maintainers may
   release the claim so someone else can pick it up (you can always reclaim
   when you're back).
5. Want to propose your _own_ starter task? Use the **Starter task pitch**
   issue template. Once accepted it gets the `good first issue` label and is
   claimable like any other.

## Development setup

```bash
npm install
npm test          # unit + integration
npm run build     # bundle to dist/
npm run lint
npm run typecheck
```

The integration tests run the built CLI from `bin/` → `dist/` — run
`npm run build` after changing source before expecting them to see your
changes.

## Architecture

The CLI is a pipeline, not a pile of hardcoded commands:

```
CLI (commander)
  ↓
Configuration collection (flags > global config > prompts > defaults)
  ↓
Validation (zod: ProjectConfig, project name, target directory)
  ↓
TemplateResolver (pure: config → file map, no I/O)
  ↓
Generator (sandboxed writes; refuses paths outside the target)
  ↓
Post-generation tasks (install, git init — each independently skippable)
  ↓
Report (next steps, exit codes 0 / 1 / 2 / 130)
```

```
src/
├── index.ts              # commander wiring + top-level error rendering
├── types.ts              # domain types, exit codes
├── commands/             # create, doctor, init, templates
├── config/               # global config (zod), project config schema
├── prompts/              # clack-based interactive flow
├── services/             # environment (doctor), package managers, git
├── templates/            # registry + merge engine + template parts
│   ├── react/            # package fragments, TS slice, JS slice
│   ├── next/             # TS slice, JS slice
│   ├── overlays/         # styling + tooling file contents
│   └── shared/           # gitignore + README renderers
├── generator/            # sandboxed file writer
└── utils/                # exec, paths, errors, logger, name validation
```

Key invariants:

- **The resolver is pure.** It never touches the filesystem, so every
  combination is unit-testable in milliseconds.
- **Templates never shell out and never hit the network.** Generation works
  offline; only dependency installation needs connectivity, and its failure
  never invalidates a generated project.
- **The generator is sandboxed.** Every write is checked to stay inside the
  target directory; traversal and absolute paths are rejected.
- **Windows is a first-class platform.** Reserved device names are rejected,
  `.cmd` shims are spawned through a shell (CVE-2024-27980 mitigation), and
  generated files use LF endings.

## Adding a framework (e.g. Vue)

1. Create `src/templates/vue/ts-part.ts` and `js-part.ts` exporting
   `vueTsPart(): TemplatePart` / `vueJsPart(): TemplatePart` with the file map
   (component files, framework config, entry HTML).
2. Add a `vueBasePackage(language, projectName)` fragment to
   `src/templates/react/package.ts` (the shared fragments module) with the
   framework's dependencies and scripts.
3. Add `"vue"` to `FRAMEWORKS` in `src/types.ts` and a case in the resolver's
   framework switch in `src/templates/registry.ts` (both the file-parts switch
   and the package-fragments switch).
4. Add styling overlay support where the framework differs (e.g. the Tailwind
   Vite vs PostCSS choice) in `src/templates/overlays/overlays.ts` and
   `tailwindPackage()` in the fragments module.
5. Add labels in `src/prompts/create-prompts.ts`, the doctor/templates output
   where relevant, and unit tests in `tests/unit/registry.test.ts` following
   the existing combo matrix.
6. Run `npm test && npm run build` and manually verify a generated project
   installs and builds.

No changes to the generator, CLI wiring, or commands are needed — that is the
point of the registry design.

Notes from adding the 0.5.0 frameworks:

- If a framework is language-constrained (Angular is TypeScript-only), list it
  in `TYPESCRIPT_ONLY_FRAMEWORKS` in `src/types.ts`; the prompts, flag
  validation and a zod cross-field check all derive from it.
- Export a `viteConfig(withTailwind: boolean)` helper from Vite-based parts so
  the Tailwind overlay re-emits the config with the plugin from the same
  source of truth.
- Verify the framework's ESLint plugin export shape before wiring it: some
  plugins export flat-config arrays, others legacy eslintrc objects (and a few
  export both under different names). The Qwik and angular-eslint configs in
  `overlays.ts` show both handling patterns.

## Adding a styling or tooling overlay

Follow `overlays/styling/tailwind` as the model: a `stylesheetFor()` branch,
any framework-specific config files, and a package.json fragment pushed from
`resolveTemplate()`. Keep overlays additive — they may override base files by
path (later parts win) but must not require changes elsewhere.

## Commit and PR style

- Conventional commits preferred (`feat:`, `fix:`, `docs:`, `chore:`).
- Commit messages carry only the author's own identity: do not append
  tool-generated attribution trailers (e.g. `Generated with …` or bot
  `Co-Authored-By:` lines). Human `Co-Authored-By:` trailers for real
  collaborators are fine.
- Every PR should include tests for new behavior; CI runs the matrix on
  Ubuntu, Windows and macOS across Node 20, 22 and 24.
- Generated-project quality is part of the contract: if you touch templates,
  verify a generated project still installs and builds.
