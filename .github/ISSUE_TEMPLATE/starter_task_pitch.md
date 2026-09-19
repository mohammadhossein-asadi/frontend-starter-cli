---
name: Starter task pitch (good first issue)
about: Pitch your own beginner-friendly task to join the good-first-issue backlog
labels: enhancement
---

<!--
Thanks for pitching a starter task! This template is for proposing NEW
beginner-friendly work. If a starter task already exists, claim it by
commenting on the issue instead.
-->

**What's the idea?**

<!-- One short paragraph. What should exist that doesn't today? -->

**Who does it help?**

<!-- The user story: "When I scaffold a ___ project, I want ___ so that ___." -->

**Why is it a good first issue?**

A starter task should be scoped, mostly additive, and build on an existing
extension point rather than redesign one. Tick what applies:

- [ ] Mostly **additive** — new data/table rows or a new overlay, not changes to existing behavior
- [ ] Builds on an extension point, e.g. the preset table (`src/config/presets.ts`), doctor checks (`src/services/environment.ts`), template overlays (`src/templates/overlays/overlays.ts`), or one row in the flag spec table (`src/commands/create-flags.ts`)
- [ ] Touches roughly ≤ 4 source files plus their tests
- [ ] Verifiable with the existing test suites (`npm test`)

**Where do you think it lives?**

<!-- Best guess at file(s) and which extension point it extends. Wrong guesses are fine — that's what the review is for. -->

**Definition of done (draft)**

<!-- What should be true when merged? e.g. files emitted only when enabled, unit tests for on/off parity, README/CHANGELOG entries. -->

---

**What happens next:** a maintainer reviews the pitch. If accepted, it gets
labeled `good first issue` (and may be lightly rescoped) — then comment to
claim it before starting, and keep the PR small.
