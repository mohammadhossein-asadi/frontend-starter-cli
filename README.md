# FrontEnd Development Starter CLI

<div align="center">

**Lightning-Fast Frontend Project Generator — React, Next.js, Vue, Svelte, SolidJS, Qwik, Astro, Angular**

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Commander.js](https://img.shields.io/badge/Commander.js-12-000000?logo=cli&logoColor=white)](https://github.com/tj/commander.js/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![npm](https://img.shields.io/npm/v/@mohammadhossein/frontend-starter-cli?color=CB3837&logo=npm)](https://www.npmjs.com/package/@mohammadhossein/frontend-starter-cli)

[🇬🇧 English](#-frontend-development-starter-cli) • [🇮🇷 فارسی](README.fa.md) • [📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**FrontEnd Development Starter CLI** (`frontend-starter-cli`) is a cross-platform command-line tool that scaffolds production-ready frontend projects in seconds. Supports **8+ frameworks** with **TypeScript**, **Tailwind CSS v4**, **ESLint**, **Prettier**, **Persian/RTL locale support**, and **best practices** pre-configured.

### 🎯 Why This CLI?

| Problem | Solution |
|---------|----------|
| Repeated project setup | **One command** — `npx create-frontend-app my-app` |
| Framework-specific configs | **Built-in** — TS, Tailwind, ESLint, Prettier per framework |
| Persian/RTL support missing | **First-class** — Vazirmatn, RTL patterns, Jalali utilities |
| Inconsistent team standards | **Enforced** — Husky, lint-staged, commitlint |

---

## ✨ Features

### ⚡ **Multi-Framework Support**
| Framework | Template | Features |
|-----------|----------|----------|
| **React** | Vite + SWC | TS, Tailwind v4, React Router |
| **Next.js** | App Router | TS, Tailwind v4, Server Actions |
| **Vue** | Vite + Vue Router | TS, Tailwind v4, Pinia, VueUse |
| **Svelte** | SvelteKit | TS, Tailwind v4, Svelte 5 |
| **SolidJS** | Vite + Solid Router | TS, Tailwind v4, Solid Primitives |
| **Qwik** | Qwik City | TS, Tailwind v4, Resumability |
| **Astro** | Islands | TS, Tailwind v4, Content Collections |
| **Angular** | CLI + Standalone | TS, Tailwind v4, Signals |

### 🎨 **Built-in Configurations**
| Tool | Configuration |
|------|---------------|
| **TypeScript** | Strict mode, path aliases, framework-specific |
| **Tailwind CSS v4** | CSS-first, Vazirmatn, RTL utilities, design tokens |
| **ESLint** | Framework rules, TypeScript, React/Vue/Svelte plugins |
| **Prettier** | Single quotes, trailing commas, 100-char width |
| **Husky** | Pre-commit (lint-staged), commit-msg (commitlint) |
| **Commitlint** | Conventional commits (feat, fix, docs, etc.) |

### 🌍 **Persian/RTL First-Class**
| Feature | Implementation |
|---------|----------------|
| **Vazirmatn Font** | `@fontsource/vazirmatn` pre-installed |
| **RTL Utilities** | Tailwind `rtl:` variant, logical properties |
| **Persian Utils** | `toPersianNumerals`, `toJalali`, `normalizePersian` |
| **Date Handling** | `jalaali-js` + `date-fns-jalali` |
| **Form Validation** | Zod schemas with Persian messages |

### 🔌 **Plugin System**
```typescript
// Custom plugin example
import { definePlugin } from 'frontend-starter-cli';

export default definePlugin({
  name: 'my-ui-library',
  frameworks: ['react', 'vue', 'svelte'],
  apply: async (context) => {
    await context.addDependency('@my/ui-lib');
    await context.addFile('src/lib/my-ui.ts', template);
  },
});
```

---

## 🏗️ Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 20+ |
| **Language** | TypeScript 5.9+ |
| **CLI Framework** | Commander.js 12 |
| **Templating** | Custom + Handlebars |
| **File System** | fs-extra + globby |
| **Package Manager** | npm / pnpm / yarn detection |
| **Git** | simple-git |
| **Testing** | Vitest |
| **Distribution** | npm (ESM) |

### Project Structure
```
frontend-starter-cli/
├── src/
│   ├── cli.ts                    # Entry point
│   ├── commands/
│   │   ├── create.ts             # create command
│   │   ├── add.ts                # add plugin/feature
│   │   └── list.ts               # list frameworks/plugins
│   ├── core/
│   │   ├── generator.ts          # Project scaffolding
│   │   ├── template-engine.ts    # Handlebars + helpers
│   │   ├── package-manager.ts    # npm/pnpm/yarn detection
│   │   └── git.ts                # Git initialization
│   ├── templates/
│   │   ├── react/
│   │   ├── nextjs/
│   │   ├── vue/
│   │   ├── svelte/
│   │   ├── solid/
│   │   ├── qwik/
│   │   ├── astro/
│   │   └── angular/
│   ├── plugins/
│   │   ├── index.ts              # Plugin registry
│   │   ├── persian-rtl.ts        # Persian/RTL utilities
│   │   ├── tailwind-v4.ts        # Tailwind v4 config
│   │   ├── eslint-prettier.ts    # Linting config
│   │   └── husky-commitlint.ts   # Git hooks
│   ├── utils/
│   │   ├── logger.ts             # Colored output
│   │   ├── prompts.ts            # Inquirer prompts
│   │   └── validation.ts         # Zod schemas
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── templates/                    # Template files (copied to src/templates at build)
├── tests/
│   ├── unit/
│   │   ├── generator.test.ts
│   │   ├── template-engine.test.ts
│   │   └── plugins.test.ts
│   └── e2e/
│       └── create.test.ts
├── bin/
│   └── create-frontend-app       # Executable entry
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Quick Start

### Installation (No Install Required)
```bash
# Run directly with npx
npx create-frontend-app@latest my-app

# Or with pnpm/yarn
pnpm dlx create-frontend-app@latest my-app
yarn create frontend-starter my-app
```

### Interactive Mode
```bash
npx create-frontend-app my-app
# ? Select framework: (Use arrow keys)
# ❯ React (Vite)
#   Next.js (App Router)
#   Vue (Vite)
#   Svelte (SvelteKit)
#   SolidJS (Vite)
#   Qwik (Qwik City)
#   Astro (Islands)
#   Angular (Standalone)
#
# ? Package manager: npm / pnpm / yarn
# ? Initialize git? Yes / No
# ? Install dependencies? Yes / No
```

### Non-Interactive (CI/CD)
```bash
# All flags
npx create-frontend-app my-app \
  --framework nextjs \
  --package-manager pnpm \
  --git \
  --install \
  --no-interactive

# Short flags
npx create-frontend-app my-app -f react -p npm -g -i
```

### Global Install (Optional)
```bash
npm install -g create-frontend-app
create-frontend-app my-app
```

---

## 🛠️ Development

### Available Commands
```bash
# Development
npm run dev              # Build & watch (tsc -w)
npm run build            # Compile to dist/
npm run start            # Run compiled CLI

# Code Quality
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run format           # Prettier

# Testing
npm test                 # Vitest unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E integration tests

# Release
npm run release          # Bump version, changelog, publish
```

### Adding a New Framework Template
```bash
# 1. Create template directory
mkdir src/templates/my-framework

# 2. Add template files with Handlebars syntax
# src/templates/my-framework/package.json.hbs
{
  "name": "{{projectName}}",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "{{devCommand}}",
    "build": "{{buildCommand}}",
    "preview": "{{previewCommand}}"
  },
  "dependencies": {
    "my-framework": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "tailwindcss": "^4.0.0",
    "@my-framework/eslint-plugin": "^1.0.0"
  }
}

# 3. Register in generator.ts
const frameworks = {
  'my-framework': {
    name: 'My Framework',
    templateDir: 'my-framework',
    packageManager: ['npm', 'pnpm', 'yarn'],
    devCommand: 'my-framework dev',
    buildCommand: 'my-framework build',
  },
};
```

### Writing Plugins
```typescript
// plugins/my-plugin.ts
import { definePlugin, PluginContext } from '../core/types';

export default definePlugin({
  name: 'my-plugin',
  description: 'Adds My Feature to projects',
  frameworks: ['react', 'vue', 'svelte'], // or ['*'] for all
  prompts: [
    {
      type: 'confirm',
      name: 'addMyFeature',
      message: 'Add My Feature?',
      default: true,
    },
  ],
  async apply(context: PluginContext) {
    if (!context.answers.addMyFeature) return;

    // Add dependency
    await context.addDependency('my-feature-lib');

    // Add files
    await context.addFile('src/lib/my-feature.ts', `
      export function myFeature() {
        return 'Hello from My Feature!';
      }
    `);

    // Modify existing files
    await context.modifyFile('src/main.ts', (content) => {
      return `import { myFeature } from './lib/my-feature';\n${content}`;
    });
  },
});
```

---

## 🧪 Testing
```bash
# Unit tests
npm test

# E2E tests (creates real projects)
npm run test:e2e

# Test specific framework
npm run test:e2e -- --framework react
npm run test:e2e -- --framework nextjs

# Coverage
npm run test:coverage
```

**Test Coverage Areas:**
- Template rendering with all variables
- Package manager detection & commands
- Git initialization & first commit
- Plugin system (apply, prompts, dependencies)
- Framework-specific configurations
- Persian/RTL utility inclusion

---

## 📚 Documentation
| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | CLI design, template engine |
| [Framework Templates](docs/TEMPLATES.md) | Adding new frameworks |
| [Plugin System](docs/PLUGINS.md) | Writing custom plugins |
| [Persian/RTL](docs/PERSIAN_RTL.md) | Vazirmatn, RTL utilities |
| [CI/CD Integration](docs/CICD.md) | GitHub Actions, GitLab CI |
| [Publishing](docs/PUBLISHING.md) | npm release workflow |

---

## 🚀 Distribution

### npm Publishing
```bash
# Login
npm login

# Build & publish
npm run build
npm publish --access public

# Or use release script
npm run release
```

### GitHub Actions Release
```yaml
# .github/workflows/release.yml
on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '26', registry-url: 'https://registry.npmjs.org' }
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env: { NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }} }
```

---

## 🔒 Security
- **No arbitrary code execution** — Templates are static Handlebars
- **Dependency validation** — Only whitelisted packages added
- **Path traversal protection** — Safe file operations
- **Supply chain** — Minimal dependencies, pinned versions
- **Audit** — `npm audit` in CI

---

## 🤝 Contributing
We welcome new frameworks, plugins, and improvements!

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-framework`
3. Add template in `src/templates/`
4. Register in `generator.ts`
5. Add tests in `tests/`
6. Run checks: `npm run lint && npm run typecheck && npm test`
7. Commit: `git commit -m "feat: add MyFramework template"`
8. Push: `git push origin feature/new-framework`
9. Open a Pull Request

### Guidelines
- Follow **existing template patterns**
- Include **Persian/RTL support** by default
- Write **comprehensive tests**
- Update **documentation**
- Keep **bundle size minimal**

---

## 📋 Roadmap

### ✅ Completed
- [x] Core CLI with Commander.js
- [x] 8 framework templates
- [x] TypeScript, Tailwind v4, ESLint, Prettier
- [x] Persian/RTL utilities (Vazirmatn, Jalali)
- [x] Husky + Commitlint + lint-staged
- [x] Plugin system architecture
- [x] Git initialization

### 🔄 In Progress
- [ ] Angular template completion
- [ ] Qwik template refinement
- [ ] E2E test coverage for all frameworks

### 📅 Planned
- [ ] Monorepo template (Nx, Turborepo)
- [ ] Backend templates (NestJS, Hono, Fastify)
- [ ] Database templates (Prisma, Drizzle, Supabase)
- [ ] Auth templates (NextAuth, Clerk, Lucia)
- [ ] Testing templates (Vitest, Playwright, Cypress)
- [ ] CI/CD templates (GitHub Actions, GitLab CI)
- [ ] Docker templates
- [ ] VS Code extension for template management
- [ ] Interactive TUI mode (Ink/React)

---

## 📄 License
**MIT License** — See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments
- **Commander.js** — CLI framework by TJ Holowaychuk
- **Vite** — Next-gen frontend tooling
- **Tailwind CSS** — Utility-first CSS framework
- **Vazirmatn Font** — Persian typography by [Rastikerdar](https://github.com/rastikerdar/vazirmatn)
- **jalaali-js** — Jalali calendar conversion
- **All Framework Teams** — React, Vue, Svelte, Solid, Qwik, Astro, Angular

---

## 📞 Support & Community
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/mohammadhossein-asadi/frontend-starter-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mohammadhossein-asadi/frontend-starter-cli/discussions)
- **npm**: [@mohammadhossein/frontend-starter-cli](https://www.npmjs.com/package/@mohammadhossein/frontend-starter-cli)
- **Email**: cli@frontend-starter.dev

---

<div align="center">

**Built with ❤️ for developers who want to start fast**

```bash
npx create-frontend-app my-app
# 🚀 Ready to code in seconds!
```

[🇬🇧 English](README.md) • [🇮🇷 فارسی](README.fa.md) • [⭐ Star us on GitHub](https://github.com/mohammadhossein-asadi/frontend-starter-cli)

</div>