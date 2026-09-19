<div align="center">

# frontend-starter

**Scaffold modern frontend projects in seconds — React, Next.js, Vue, Svelte,
SolidJS, Qwik, Astro and Angular, with TypeScript, Tailwind v4, ESLint,
Prettier and Git wired the right way on Windows, Linux and macOS.**

[![CI](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/frontend-starter-cli)](https://www.npmjs.com/package/frontend-starter-cli)
[![node](https://img.shields.io/node/v/frontend-starter-cli)](https://www.npmjs.com/package/frontend-starter-cli)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## Why

`create-vite` and friends are great — if you know exactly which flags to pass
and don't mind assembling ESLint, Prettier, Tailwind and Git yourself.
**frontend-starter** asks a few friendly questions (or takes flags, or reads
your saved defaults) and generates a _complete, coherent_ project:

- ✅ framework + language + styling + tooling composed into one project
- ✅ **actually working** Tailwind v4 — the Vite plugin / PostCSS config /
  `.postcssrc.json` is emitted per toolchain, so CSS is compiled, not imported
- ✅ flat-config ESLint with the right plugin per framework (react-hooks,
  eslint-plugin-vue, eslint-plugin-svelte, qwik, angular-eslint, …)
- ✅ Prettier (with Svelte/Astro plugins where needed) + `.prettierignore`
- ✅ Git initialized with a clean first commit (optional)
- ✅ safe by default — never touches an existing directory without `--force`
- ✅ offline generation: files are written from bundled templates _before_ any
  network call, so a failed install never leaves a half-written project

Every template is verified with a real `npm install` + production build +
clean lint run on CI (Ubuntu / Windows / macOS × Node 20 / 22 / 24).

## Supported frameworks

| Framework | Bundler / Router | Languages              | Styling                             |
| --------- | ---------------- | ---------------------- | ----------------------------------- |
| React     | Vite             | TypeScript, JavaScript | Tailwind v4, CSS Modules, Plain CSS |
| Next.js   | App Router       | TypeScript, JavaScript | Tailwind v4, CSS Modules, Plain CSS |
| Vue 3     | Vite             | TypeScript, JavaScript | Tailwind v4, CSS Modules, Plain CSS |
| Svelte 5  | Vite             | TypeScript, JavaScript | Tailwind v4, Plain CSS              |
| SolidJS   | Vite             | TypeScript, JavaScript | Tailwind v4, Plain CSS              |
| Qwik      | Qwik City (Vite) | TypeScript, JavaScript | Tailwind v4, Plain CSS              |
| Astro     | Astro (Vite)     | TypeScript, JavaScript | Tailwind v4, Plain CSS              |
| Angular   | @angular/build   | TypeScript             | Tailwind v4, CSS Modules, Plain CSS |

Notes on the versions we ship:

- **Angular** projects are TypeScript-only (as its own CLI is) and use stable
  **zoneless** change detection — no `zone.js`, no polyfills.
- **Qwik** pins Vite `^7` until its plugin's peer range allows Vite 8.
- **Astro** pins Astro `^5` until its toolchain supports Node 20.19.
- **React** is the React 19 + plugin-react line; **Svelte** uses runes
  (`$state`) with `svelte-check` in TypeScript projects.

Adding a framework is a registry entry away — see
[CONTRIBUTING.md](CONTRIBUTING.md); Vue's implementation is the reference
example.

## Installation

```bash
npm install -g frontend-starter-cli
```

or run it once without installing:

```bash
npx frontend-starter-cli
```

Requires **Node.js ≥ 20.19** (CI tests 20, 22 and 24).

## Quick start

```bash
# fully interactive
frontend-starter

# name it and go
frontend-starter create my-app

# scripted, no questions asked
frontend-starter create my-app \
  --framework react \
  --typescript \
  --tailwind \
  --package-manager pnpm

# an opinionated bundle in one shot
frontend-starter create my-blog --preset blog

# look before you leap
frontend-starter create my-app --framework next --typescript --tailwind --dry-run
```

The interactive flow (shortened):

```
◆  Starting point
❯ Blog           — content-focused site with Tailwind and full tooling
  Dashboard      — data-heavy app UI with Tailwind and full tooling
  Landing page   — single marketing page with Tailwind, minimal tooling
  Custom         — choose each option yourself

◆  Choose framework
❯ React (Vite)
  Next.js (App Router)
  Vue (Vite)
  Svelte (Vite)
  …and Solid, Qwik, Astro, Angular
```

## Commands

| Command                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `frontend-starter`               | Interactive create flow (default command)             |
| `frontend-starter create [name]` | Create a new project                                  |
| `frontend-starter init`          | Save your defaults to the global config               |
| `frontend-starter templates`     | List supported frameworks and options (alias: `list`) |
| `frontend-starter doctor`        | Check your environment for missing tooling            |
| `frontend-starter --version`     | Print the version                                     |
| `frontend-starter --help`        | Show help                                             |

Global flags: `--verbose` (detailed diagnostics) and `--quiet` (suppress
informational output).

## `create` flags

| Flag                            | Values                                                                | Notes                                        |
| ------------------------------- | --------------------------------------------------------------------- | -------------------------------------------- |
| `--preset`                      | `blog`, `dashboard`, `landing-page`                                   | one choice for framework + styling + extras  |
| `--framework`                   | `react`, `next`, `vue`, `svelte`, `solid`, `qwik`, `astro`, `angular` | see the frameworks table above               |
| `--language`                    | `typescript`, `javascript`                                            |                                              |
| `--typescript` / `--javascript` |                                                                       | shorthand for `--language`                   |
| `--styling`                     | `tailwind`, `css-modules`, `plain`                                    |                                              |
| `--tailwind`                    |                                                                       | shorthand for `--styling tailwind`           |
| `--package-manager`             | `pnpm`, `npm`, `yarn`, `bun`                                          | must be installed; never auto-installed      |
| `--eslint` / `--no-eslint`      |                                                                       | default: on                                  |
| `--prettier` / `--no-prettier`  |                                                                       | default: on                                  |
| `--git` / `--no-git`            |                                                                       | default: on                                  |
| `--install` / `--no-install`    |                                                                       | default: on (interactive), off (`--yes`)     |
| `--force`                       |                                                                       | add files to an existing non-empty directory |
| `--dry-run`                     |                                                                       | preview the file tree + `package.json`       |
| `--yes`                         |                                                                       | non-interactive; never prompt                |

### Non-interactive defaults

With `--yes` (or no TTY), the four core choices are required
(`--framework`, `--typescript|--javascript`, `--styling`,
`--package-manager`). ESLint, Prettier and Git default to **on**; dependency
installation defaults to **off** so CI runs never hit the network
unexpectedly. Override any of them explicitly (`--no-eslint`, `--install`, …).

### Starting points (presets)

A preset bundles framework, language, styling and extras into one choice; the
package manager stays machine-specific and is auto-detected. Pick it
interactively (the "Starting point" question) or by flag:

```bash
frontend-starter create my-blog --preset blog
```

Precedence is `flags > preset > global config`, so
`--preset blog --framework vue` yields Vue with the blog's styling and extras.
`frontend-starter templates` lists the available presets.

### Preview without generating

```bash
frontend-starter create my-app --framework next --typescript --tailwind --dry-run
```

Prints every file the generator would create (plus the full `package.json`)
and writes nothing. If the target directory already exists and is not empty,
the preview warns instead of failing — handy for checking a layout before a
real generation or in CI.

## Supported package managers

`pnpm` · `npm` · `yarn` · `bun`

The CLI detects what is installed and offers the available ones. Detection
order defaults to `pnpm > npm > yarn > bun` and is configurable. A requested
but missing package manager is an error with install instructions — the CLI
never installs package managers on its own.

## Configuration

Save your defaults once and answer fewer questions forever
(`frontend-starter init` writes the file for you):

- Windows: `%APPDATA%\frontend-starter\config.json`
- macOS: `~/Library/Preferences/frontend-starter/config.json`
- Linux: `$XDG_CONFIG_HOME/frontend-starter/config.json` (or `~/.config/...`)

```json
{
  "packageManager": "pnpm",
  "framework": "react",
  "language": "typescript",
  "styling": "tailwind",
  "eslint": true,
  "prettier": true,
  "git": true,
  "install": true,
  "detectionOrder": ["pnpm", "npm", "yarn", "bun"]
}
```

Precedence: **flags > preset > global config > prompts > defaults**.
The file may also live at `~/.frontend-starter/config.json`, and
`FRONTEND_STARTER_CONFIG_DIR` overrides the directory (useful for tests and
sandboxes).

## Exit codes

| Code  | Meaning                                                                         |
| ----- | ------------------------------------------------------------------------------- |
| `0`   | Success                                                                         |
| `1`   | Generation failed (bad input, unsafe target, environment problem)               |
| `2`   | Project generated, but a post-step (install, git) failed — the files are usable |
| `130` | Cancelled by the user (Ctrl+C)                                                  |

## Troubleshooting

**`pnpm was not found`**
The selected package manager is not installed. Install it (`npm install -g pnpm`)
or run with `--package-manager npm`.

**Directory already exists**
The CLI never overwrites silently. Pick another name, or pass `--force` to add
the template files into the existing directory.

**Dependency installation failed**
Project files are already in place. Install manually:

```bash
cd my-project && pnpm install
```

**Git commit fails with identity errors**
`git config --global user.name "Your Name"` then
`git config --global user.email "you@example.com"`.

**Something still off?**
Run `frontend-starter doctor --verbose` and include the output in an issue.

## Development

```bash
git clone https://github.com/mohammadhossein-asadi/frontend-starter-cli
cd frontend-starter-cli
npm install
npm run dev          # watch-mode build
npm test             # unit + integration tests
npm run build        # production build to dist/
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run format       # prettier
```

### Testing

- **Unit tests** cover name validation, JSON merging, template composition for
  every framework × language × styling combination, config precedence, preset
  expansion and doctor reporting.
- **Integration tests** execute the built CLI end-to-end in temp directories:
  real generation, `--dry-run` previews (asserting _nothing_ is written),
  flag validation, Angular's TypeScript-only rule, existing-directory
  protection, git initialization and exit codes.

CI runs the full matrix on every push and PR:

```
ubuntu-latest · windows-latest · macos-latest  ×  Node 20 · 22 · 24
```

### Nightly framework builds

Templates depend on upstream packages that release independently of this repo —
scaffolded projects can break without a single commit here. A scheduled
workflow ([nightly-builds.yml](.github/workflows/nightly-builds.yml)) guards
against that rot: every day it uses the built CLI to generate one real project
per framework (Tailwind + ESLint, TypeScript), then runs `npm install`,
`npm run lint` and `npm run build` inside it — across Node 20 · 22 · 24. If an
upstream release breaks a template, the failing leg names the framework the
next morning. It can also be triggered manually from the Actions tab
(workflow_dispatch).

### Architecture in one paragraph

Everything is registry-driven. A validated `ProjectConfig` flows into
`resolveTemplate()`, which stacks **template parts**: a framework base
(`src/templates/<framework>/`), a language slice, styling overlays
(stylesheet + the framework's Tailwind wiring), tooling overlays (ESLint,
Prettier), then shared files (`package.json` composed from ordered JSON
fragments, README, `.gitignore`). CLI flags are declared _and_ read from one
typed spec table (`src/commands/create-flags.ts`), so a flag can never exist
in help text but not in code. Adding a framework touches templates and the
registry — never the generator, commands or prompts. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the step-by-step tour.

## Publishing

Releases are automated: push a tag (`v0.5.0`) and the release workflow builds,
tests and publishes to npm with provenance. For a manual release:

```bash
npm run build
npm publish
```

## Contributing

Contributions welcome — new templates, presets, prompt improvements and
fixes. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the architecture tour and
the step-by-step guide to adding a framework. Looking for a starting point?
Each [good first issue](https://github.com/mohammadhossein-asadi/frontend-starter-cli/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
lists the files to touch and a definition of done.

## License

[MIT](LICENSE)
