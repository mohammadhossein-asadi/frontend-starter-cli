# frontend-starter

[![CI](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/frontend-starter-cli.svg)](https://www.npmjs.com/package/frontend-starter-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Fast, cross-platform generator for modern frontend projects.
Windows · Linux · macOS — one command, a fully configured project.

```bash
npx frontend-starter-cli
```

> **Note:** the npm package is published as **`frontend-starter-cli`** (the plain
> `frontend-starter` name was already taken). The installed command is
> `frontend-starter`.

## Choose → Configure → Generate → Install → Run

`frontend-starter` asks a handful of questions (framework, language, styling,
package manager, tooling) and generates a clean, production-ready project —
then optionally installs dependencies and initializes Git.

```
◆  frontend-starter
│
●  Project name: my-app
│
●  Choose framework
│  ● React (Vite)
│  ○ Next.js (App Router)
│
●  Choose language
│  ● TypeScript
│  ○ JavaScript
│
●  Choose styling
│  ● Tailwind CSS v4
│  ○ CSS Modules
│  ○ Plain CSS
└  Your project is ready.
```

## Features

- **Interactive by default** — fast, friendly prompts; every answer can be
  provided as a flag instead
- **Non-interactive mode** — full flag support for CI, scripts and Docker
- **Cross-platform** — Windows (including reserved-name and `.cmd` handling),
  Linux, macOS; no shell-specific assumptions
- **Offline generation** — templates are generated from bundled code, so a
  failed install never leaves you with a half-written project
- **Safe by default** — refuses to touch existing directories without explicit
  consent; validates names against npm and Windows rules
- **Composable templates** — framework base + language slice + styling +
  tooling overlays, merged into one coherent project
- **Environment doctor** — `frontend-starter doctor` explains exactly what is
  missing and how to fix it
- **Global defaults** — save your preferences once, get less prompting forever

## Installation

```bash
npm install -g frontend-starter-cli
```

or run it once without installing:

```bash
npx frontend-starter-cli
```

Requires Node.js ≥ 20.19.

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

## `create` flags

| Flag                            | Values                              | Notes                                                             |
| ------------------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `--preset`                      | `blog`, `dashboard`, `landing-page` | one choice for framework + styling + extras                       |
| `--framework`                   | `react`, `next`, `vue`              | React uses Vite; Next uses the App Router                         |
| `--typescript` / `--javascript` |                                     | shorthand for `--language`                                        |
| `--language`                    | `typescript`, `javascript`          |                                                                   |
| `--tailwind`                    |                                     | shorthand for `--styling tailwind`                                |
| `--styling`                     | `tailwind`, `css-modules`, `plain`  |                                                                   |
| `--package-manager`             | `pnpm`, `npm`, `yarn`, `bun`        | must be installed; never auto-installed                           |
| `--eslint` / `--no-eslint`      |                                     | default: on                                                       |
| `--prettier` / `--no-prettier`  |                                     | default: on                                                       |
| `--git` / `--no-git`            |                                     | default: on                                                       |
| `--install` / `--no-install`    |                                     | default: on (interactive), off (`--yes`)                          |
| `--force`                       |                                     | overwrite files in an existing non-empty directory                |
| `--dry-run`                     |                                     | preview the file tree and `package.json` without writing anything |
| `--yes`                         |                                     | non-interactive; never prompt                                     |

Global flags: `--verbose` (detailed diagnostics), `--quiet` (suppress
informational output).

### Non-interactive defaults

With `--yes` (or no TTY), the four core choices are required
(`--framework`, `--typescript|--javascript`, `--styling`, `--package-manager`).
ESLint, Prettier and Git default to **on**; dependency installation defaults to
**off** so CI runs never hit the network unexpectedly. Override any of them
explicitly with `--eslint=false`-style negations (`--no-eslint`, `--install`, …).

### Starting points (presets)

Pick an opinionated bundle in one shot — interactively (the "Starting point"
question at the top of the flow) or with a flag:

```bash
frontend-starter create my-blog --preset blog
```

Presets bundle framework, language, styling and extras; the package manager
stays machine-specific and is auto-detected. Precedence is `flags > preset >
global config`, so `--preset blog --framework vue` yields Vue with the blog's
styling and extras. `frontend-starter templates` lists the available presets.

### Preview without generating

```bash
frontend-starter create my-app --framework next --typescript --tailwind --dry-run
```

Prints every file the generator would create (plus the full `package.json`) and
writes nothing. If the target directory already exists and is not empty, the
preview warns instead of failing — handy for checking a layout before a real
generation or in CI.

## Supported frameworks

| Framework | Bundler/Router | Languages              | Styling                             |
| --------- | -------------- | ---------------------- | ----------------------------------- |
| React     | Vite           | TypeScript, JavaScript | Tailwind v4, CSS Modules, Plain CSS |
| Next.js   | App Router     | TypeScript, JavaScript | Tailwind v4, CSS Modules, Plain CSS |
| Vue 3     | Vite           | TypeScript, JavaScript | Tailwind v4, CSS Modules, Plain CSS |

Adding SvelteKit, Astro and friends is a registry entry away — see
[CONTRIBUTING.md](CONTRIBUTING.md). Vue was added exactly that way; its
implementation (`src/templates/vue/`, registry cases, overlay branches) is the
reference example.

## Supported package managers

`pnpm` · `npm` · `yarn` · `bun`

The CLI detects what is installed and offers the available ones. Detection
order defaults to `pnpm > npm > yarn > bun` and is configurable. A requested
but missing package manager is an error with install instructions — the CLI
never installs package managers on its own.

## Configuration

Global defaults live in a platform-appropriate directory:

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

Precedence: **flags > global config > prompts > defaults**.
The file may also live at `~/.frontend-starter/config.json`, and
`FRONTEND_STARTER_CONFIG_DIR` overrides the directory for tests and sandboxes.

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
```

## Testing

- **Unit tests** cover name validation, JSON merging, template composition for
  every framework × language × styling combination, config precedence and
  doctor reporting.
- **Integration tests** execute the built CLI end-to-end in temp directories:
  generation for multiple stacks, flag validation, existing-directory
  protection, error paths, exit codes.

## Publishing

Releases are automated: push a tag (`v0.1.1`) and the release workflow builds,
tests and publishes with provenance. For a manual release:

```bash
npm run build
npm publish
```

## Contributing

Contributions welcome — new templates, prompt improvements and fixes. Read
[CONTRIBUTING.md](CONTRIBUTING.md) for the architecture tour and the
step-by-step guide to adding a framework.

## License

[MIT](LICENSE)
