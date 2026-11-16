# Project DNA — FrontEnd Development Starter

## Project Identity

| Field | Value |
|-------|-------|
| **Project Name** | FrontEnd Development Starter |
| **Repository** | `frontend-starter-cli` |
| **Type** | CLI Tool (Node.js) |
| **Primary Language** | TypeScript |
| **Package Manager** | npm |

---

## Purpose & Problem Statement

**Problem**: Developers need a fast, cross-platform generator for modern frontend projects that supports multiple frameworks (React, Next.js, Vue, Svelte, SolidJS, Qwik, Astro, Angular) with TypeScript, Tailwind CSS, ESLint, and Prettier out of the box.

**Solution**: A command-line interface that scaffolds complete frontend projects with all recommended configurations, dependencies, and best practices pre-installed, supporting Persian/RTL locales.

---

## Target Users

- **Primary**: Frontend developers and teams starting new projects across multiple frameworks
- **Secondary**: Bootcamp instructors and course developers needing consistent project setups
- **Tertiary**: Agencies requiring rapid project initialization for clients

---

## Core Features (Implemented)

| Feature | Status | Description |
|---------|--------|-------------|
| Multi-framework Support | ✅ Implemented | Generates projects for 8+ frameworks |
| TypeScript Config | ✅ Implemented | Framework-specific tsconfig.json |
| Tailwind CSS Integration | ✅ Implemented | Config with JIT mode |
| ESLint & Prettier | ✅ Implemented | Framework-specific configs |
| Persian/Rtl Support | ✅ Implemented | Vazirmatn font and RTL patterns |
| Plugin System | ✅ Implemented | Extensible generator plugins |
| Git Initialization | ✅ Implemented | Automatic repo setup |

---

## Technical Requirements

| Requirement | Detail |
|-------------|--------|
| **Runtime** | Node.js 20+ |
| **Language** | TypeScript 5.9+ |
| **Package Manager** | npm or pnpm |
| **Scaffolding Engine** | Custom CLI with commander.js |
| **Output** | `dist/` directory with all configs |