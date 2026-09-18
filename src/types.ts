/**
 * Shared domain types for the frontend-starter CLI.
 *
 * These types are deliberately framework-agnostic: adding a new framework
 * later must only require new template directories plus entries in the
 * registry — never changes to these core types.
 */

export const FRAMEWORKS = [
  "react",
  "next",
  "vue",
  "svelte",
  "solid",
  "qwik",
  "astro",
  "angular",
] as const;
export type Framework = (typeof FRAMEWORKS)[number];

/** Frameworks whose generated projects are TypeScript-only. */
export const TYPESCRIPT_ONLY_FRAMEWORKS: readonly Framework[] = ["angular"];

/** Languages a given framework supports (Angular requires TypeScript). */
export function allowedLanguages(framework: Framework): readonly Language[] {
  return TYPESCRIPT_ONLY_FRAMEWORKS.includes(framework) ? ["typescript"] : LANGUAGES;
}

export const LANGUAGES = ["typescript", "javascript"] as const;
export type Language = (typeof LANGUAGES)[number];

export const STYLINGS = ["tailwind", "css-modules", "plain"] as const;
export type Styling = (typeof STYLINGS)[number];

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

/** Exit codes with stable semantics for scripts and CI. */
export const EXIT_CODES = {
  ok: 0,
  /** Generation itself failed; nothing usable was produced. */
  generationFailed: 1,
  /** Project files exist but a post-generation task (install, git) failed. */
  postTaskFailed: 2,
  /** The user aborted a prompt (Ctrl+C). */
  cancelled: 130,
} as const;

/** Full, validated description of the project the user asked for. */
export interface ProjectConfig {
  projectName: string;
  framework: Framework;
  language: Language;
  styling: Styling;
  packageManager: PackageManager;
  eslint: boolean;
  prettier: boolean;
  git: boolean;
  install: boolean;
  /** Overwrite an existing non-empty target directory (explicit consent only). */
  force: boolean;
}

/** What a template part contributes before the generator writes anything. */
export interface TemplatePart {
  /** Stable identifier, e.g. "react/_ts" or "overlays/tailwind/react". */
  id: string;
  files: Record<string, string>;
}

/** Result of resolving a full configuration into files. */
export interface ResolvedTemplate {
  framework: Framework;
  language: Language;
  styling: Styling;
  parts: string[];
  files: Record<string, string>;
}

/** One row of the `doctor` report. */
export interface DoctorCheck {
  name: string;
  ok: boolean;
  detail: string;
  /** Remediation when not ok. */
  hint?: string;
  /** Optional tools do not fail the overall environment report. */
  optional?: boolean;
}
