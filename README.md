<div align="center">

# frontend-starter

**Create production-ready frontend projects in seconds.**

Choose from React, Next.js, Vue, Svelte, SolidJS, Qwik, Astro, and Angular — then add TypeScript or JavaScript, Tailwind CSS v4, ESLint, Prettier, and Git with one interactive or scriptable command.

[![CI](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/frontend-starter-cli)](https://www.npmjs.com/package/frontend-starter-cli)
[![Node.js](https://img.shields.io/node/v/frontend-starter-cli)](https://www.npmjs.com/package/frontend-starter-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🇬🇧 English](README.md) • [🇮🇷 فارسی](README.fa.md) • [📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**frontend-starter** is a cross-platform command-line tool for building complete, ready-to-work frontend project foundations. Instead of choosing a framework generator and then hand-assembling styling, linting, formatting, and Git configuration, you pick your options once and generate a consistent project in one step.

Use interactive prompts to explore choices, pass flags for repeatable setups, or save preferences in a global config and reuse them later. Templates are bundled with the CLI, so project files are generated locally before optional dependency installation begins.

### 🎯 Why frontend-starter?

| Starting a project can mean… | frontend-starter helps by… |
| --- | --- |
| Comparing framework-specific generators and flags | Offering 8 popular frameworks through one CLI |
| Wiring up styling and tooling by hand | Composing framework-aware Tailwind, ESLint, and Prettier templates |
| Repeating the same setup choices | Saving defaults in a cross-platform global config |
| Guessing what a command will create | Previewing the file tree and `package.json` with `--dry-run` |
| Accidentally overwriting existing work | Refusing unsafe writes unless you explicitly pass `--force` |
| Hitting a network error halfway through setup | Writing bundled template files before attempting package installation |

---

## ✨ Features

### 🧰 One CLI, eight frameworks

Generate projects for **React, Next.js, Vue 3, Svelte 5, SolidJS, Qwik, Astro,** and **Angular**. Pick a framework in the interactive flow or select it with `--framework`.

### 🧩 Choose your project setup

- **Languages:** TypeScript or JavaScript where supported (Angular is TypeScript-only).
- **Styling:** Tailwind CSS v4, CSS Modules, or plain CSS where supported by the framework.
- **Tooling:** Optional ESLint and Prettier, with framework-specific configuration.
- **Git:** Initialize a repository and make an initial commit, or opt out.
- **Package managers:** pnpm, npm, yarn, and bun.
- **Presets:** Blog, dashboard, and landing-page starting points bundle common choices.

### ✅ Complete, framework-aware templates

Tailwind is configured for the framework's toolchain instead of merely being added as a stylesheet import. Templates include the appropriate Vite plugin, PostCSS configuration, or framework-specific integration. ESLint and Prettier templates account for framework plugins and file types.

### 🛡️ Safe and predictable generation

- Existing directories are not overwritten silently; `--force` is explicit.
- `--dry-run` previews generated files without writing them.
- Templates are bundled locally; generation itself does not need a network connection.
- If dependency installation fails after generation, project files remain available for manual installation.
- Non-interactive defaults avoid unexpected package installs.

### 🌍 Cross-platform

Designed for **Windows, macOS, and Linux**. CI exercises all three operating systems across supported Node.js versions.

---

## 🧰 Supported frameworks

| Framework | Toolchain | Languages | Styling options |
| --- | --- | --- | --- |
| React | Vite | TypeScript, JavaScript | Tailwind v4, CSS Modules, plain CSS |
| Next.js | App Router | TypeScript, JavaScript | Tailwind v4, CSS Modules, plain CSS |
| Vue 3 | Vite | TypeScript, JavaScript | Tailwind v4, CSS Modules, plain CSS |
| Svelte 5 | Vite | TypeScript, JavaScript | Tailwind v4, plain CSS |
| SolidJS | Vite | TypeScript, JavaScript | Tailwind v4, plain CSS |
| Qwik | Qwik City (Vite) | TypeScript, JavaScript | Tailwind v4, plain CSS |
| Astro | Astro (Vite) | TypeScript, JavaScript | Tailwind v4, plain CSS |
| Angular | `@angular/build` | TypeScript | Tailwind v4, CSS Modules, plain CSS |

**Template notes:**

- Angular templates use TypeScript and zoneless change detection.
- Qwik currently uses Vite 7 to match its plugin's supported peer range.
- Astro currently uses the Astro 5 line to support the project's Node.js floor.
- React templates use React 19. Svelte templates use Svelte 5 runes; TypeScript projects include `svelte-check`.
- Tailwind v4 configuration is emitted for the corresponding toolchain (Vite, Next.js, Astro, Angular).

---

## 🏗️ Architecture

### Tech stack (CLI)

| Layer | Technology |
| --- | --- |
| **Language** | TypeScript 5 (strict) |
| **CLI** | Commander |
| **Prompts** | `@clack/prompts` |
| **Validation** | Zod |
| **Process execution** | execa |
| **Output styling** | picocolors |
| **Build** | tsup |
| **Tests** | Vitest |

### How it works

```text
CLI and prompts
      ↓
Configuration and validation
      ↓
Template resolver (configuration → file map)
      ↓
Sandboxed generator (writes within the target directory)
      ↓
Optional post-generation tasks (dependency install, Git)
      ↓
Summary and next steps
```

### Project structure

```text
src/
├── index.ts              # CLI wiring and error rendering
├── types.ts              # Domain types and exit codes
├── commands/             # create, doctor, init, templates
├── config/               # Global config and project configuration
├── prompts/              # Interactive setup flow
├── services/             # Environment checks, package managers, Git
├── templates/            # Framework registry, template parts, overlays
├── generator/             # Sandboxed file writer
└── utils/                # Paths, execution, logging, errors, validation
```

Generation templates do not shell out or access the network. Only optional post-generation actions (installing dependencies, Git) need external tools or connectivity. The generator checks output paths to keep writes inside the selected project directory.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js ≥ 20.19**
- A supported package manager if you want the CLI to install dependencies: **pnpm, npm, yarn,** or **bun**

### Install globally

```bash
npm install -g frontend-starter-cli
```

Start the interactive flow:

```bash
frontend-starter
```

### Run without installing globally

```bash
npx frontend-starter-cli
```

### Create a project

```bash
# Interactive project creation
frontend-starter create

# Explicit options
frontend-starter create my-app \
  --framework react \
  --typescript \
  --tailwind \
  --package-manager pnpm

# Start with a preset
frontend-starter create my-blog --preset blog

# Preview before creating files
frontend-starter create my-app \
  --framework next \
  --typescript \
  --tailwind \
  --dry-run
```

The interactive flow can start with a **Blog**, **Dashboard**, **Landing page**, or **Custom** setup, then guides you through framework and project choices.

---

## ⚙️ Commands

| Command | Description |
| --- | --- |
| `frontend-starter` | Start the interactive project creation flow. |
| `frontend-starter create [name]` | Create a project with prompts or explicit options. |
| `frontend-starter init` | Save personal defaults in the global configuration. |
| `frontend-starter templates` | List supported frameworks, presets, and options (`list` alias). |
| `frontend-starter doctor` | Check the environment and available tooling. |
| `frontend-starter --version` | Print the installed CLI version. |
| `frontend-starter --help` | Show help. |

Global output flags:

- `--verbose` — show detailed diagnostics.
- `--quiet` — suppress informational output.

### `create` options

| Option | Values / behavior |
| --- | --- |
| `--preset` | `blog`, `dashboard`, or `landing-page`. |
| `--framework` | `react`, `next`, `vue`, `svelte`, `solid`, `qwik`, `astro`, or `angular`. |
| `--language` | `typescript` or `javascript`, where supported. |
| `--typescript`, `--javascript` | Shortcuts for `--language`. |
| `--styling` | `tailwind`, `css-modules`, or `plain`, where supported. |
| `--tailwind` | Shortcut for `--styling tailwind`. |
| `--package-manager` | `pnpm`, `npm`, `yarn`, or `bun`; the selected manager must already be installed. |
| `--eslint`, `--no-eslint` | Enable or disable ESLint (enabled by default). |
| `--prettier`, `--no-prettier` | Enable or disable Prettier (enabled by default). |
| `--git`, `--no-git` | Initialize Git or skip it (enabled by default). |
| `--install`, `--no-install` | Install dependencies or skip installation. |
| `--force` | Add template files to an existing non-empty directory. |
| `--dry-run` | Preview the generated file tree and `package.json`; write nothing. |
| `--yes` | Run without prompts; required choices must be supplied as flags or resolved from configuration. |

### Non-interactive usage

With `--yes` (or in a non-interactive terminal), provide the four core choices: framework, language, styling, and package manager. ESLint, Prettier, and Git default to **on**. Dependency installation defaults to **off** in non-interactive mode to avoid unexpected network requests.

```bash
frontend-starter create my-app \
  --framework vue \
  --typescript \
  --tailwind \
  --package-manager npm \
  --yes
```

### Presets and option precedence

Presets bundle framework, language, styling, and extras; the package manager is machine-specific and detected/selected separately.

```bash
frontend-starter create my-dashboard --preset dashboard
```

Precedence when a choice is specified in multiple places:

**flags > preset > global config > prompts > defaults**

---

## 📦 Package managers

Supported managers: **pnpm**, **npm**, **yarn**, and **bun**. The CLI detects installed options and uses a configurable detection order (default: `pnpm`, `npm`, `yarn`, `bun`).

A requested package manager that is not installed results in an actionable error. The CLI does not install package managers for you.

---

## 🔧 Configuration

Run `frontend-starter init` to save defaults and reduce repeated prompts. Configuration is stored in a platform-specific user directory:

- **Windows:** `%APPDATA%\frontend-starter\config.json`
- **macOS:** `~/Library/Preferences/frontend-starter/config.json`
- **Linux:** `$XDG_CONFIG_HOME/frontend-starter/config.json` (or `~/.config/frontend-starter/config.json`)

Example:

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

A config file can also live at `~/.frontend-starter/config.json`. Set `FRONTEND_STARTER_CONFIG_DIR` to override the config directory (useful for tests/isolated environments). Config contains project preferences; it is not intended for storing secrets.

---

## 🛠️ Development

### Local setup

```bash
git clone https://github.com/mohammadhossein-asadi/frontend-starter-cli.git
cd frontend-starter-cli
npm install
```

### Scripts

```bash
npm run dev          # Watch-mode build
npm run build        # Build to dist/
npm test             # Unit and integration tests
npm run test:watch   # Tests in watch mode
npm run coverage     # Coverage
npm run lint         # ESLint
npm run typecheck    # TypeScript checks
npm run format       # Prettier
npm run format:check # Check formatting
```

Integration tests run the built CLI via `bin/` and `dist/`; run `npm run build` after source changes before relying on them.

### What is tested

- Name/input validation, configuration precedence, presets, and template composition.
- Framework, language, and styling combinations.
- End-to-end generation, dry-run behavior, existing-directory safety, Git initialization, and exit codes.
- Generated project templates in CI, including install, lint, and production build checks.

CI runs on **Ubuntu, Windows, and macOS** with **Node.js 20, 22, and 24**. A scheduled workflow checks generated framework projects against upstream dependency changes.

---

## 🚨 Troubleshooting

### `pnpm` (or another manager) was not found

The selected package manager is not installed. Install it or choose an available one:

```bash
frontend-starter create my-app --package-manager npm
```

### The destination directory already exists

The CLI avoids silently overwriting files. Choose another name, or use `--force` to intentionally add template files to an existing non-empty directory.

### Dependency installation failed

Generated files are already in place. Install manually:

```bash
cd my-app
pnpm install
```

### Git could not create the initial commit

Configure your Git identity and retry:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### Environment diagnosis

```bash
frontend-starter doctor --verbose
```

---

## 📚 Documentation

| Document | Description |
| --- | --- |
| [Contributing guide](CONTRIBUTING.md) | Architecture, development workflow, adding frameworks/overlays |
| [Changelog](CHANGELOG.md) | Release history and notable changes |
| [Issues](https://github.com/mohammadhossein-asadi/frontend-starter-cli/issues) | Bug reports and feature requests |
| [Discussions](https://github.com/mohammadhossein-asadi/frontend-starter-cli/discussions) | Questions and community conversation |

---

## 📤 Publishing

Releases are automated through the repository's release workflow. To publish manually:

```bash
npm run build
npm publish
```

---

## 🤝 Contributing

Contributions are welcome — framework templates, presets, prompt improvements, documentation, and bug fixes.

1. Review the [contributing guide](CONTRIBUTING.md).
2. For a `good first issue`, follow the issue's instructions to claim it before starting.
3. Open a draft pull request early when useful, and include tests for new behavior.
4. If you change templates, verify that a generated project installs, lints, and builds.

---

## 📋 Roadmap

- [x] 8 framework generators (React, Next.js, Vue, Svelte, SolidJS, Qwik, Astro, Angular)
- [x] TypeScript/JavaScript, Tailwind v4, ESLint, Prettier, Git
- [x] Presets (blog, dashboard, landing-page)
- [x] `--dry-run`, `--force`, global config, `doctor`
- [x] Cross-platform CI (Ubuntu, Windows, macOS)
- [ ] Additional presets and template variants
- [ ] More styling/tooling integrations (as requested)
- [ ] Community-contributed framework overlays

---

## 📄 License

**MIT License** — See [LICENSE](LICENSE).

---

## 🙏 Acknowledgments

- **Commander**, **@clack/prompts**, **Zod**, **execa**, **picocolors** — CLI foundations
- **tsup**, **Vitest**, **TypeScript**, **ESLint**, **Prettier** — build & quality
- The ecosystems behind **React, Next.js, Vue, Svelte, SolidJS, Qwik, Astro, Angular, Vite, Tailwind CSS**

---

<div align="center">

**Build your next frontend project with less setup and more momentum.**

[🇬🇧 English](README.md) • [🇮🇷 فارسی](README.fa.md) • [⭐ Star on GitHub](https://github.com/mohammadhossein-asadi/frontend-starter-cli) • [📦 View on npm](https://www.npmjs.com/package/frontend-starter-cli) • [🐛 Report an issue](https://github.com/mohammadhossein-asadi/frontend-starter-cli/issues)

</div>
