import { z } from "zod";
import { FRAMEWORKS, LANGUAGES, STYLINGS, type ProjectConfig } from "../types.js";
import { ValidationError } from "../utils/errors.js";

/**
 * Project presets: one choice that bundles framework, language, styling and
 * extras into an opinionated starting point. Presets sit between CLI flags
 * (highest) and global config (lowest):
 *
 *   flags > preset > global config > prompts > defaults
 *
 * A preset never overrides an explicit flag, so `--preset blog --framework
 * vue` yields Vue with the blog's styling and extras. Presets only fill
 * fields they declare — adding a preset is pure data; no CLI or generator
 * changes.
 */

/** The value bundle a preset applies, before any flag-level override. */
export const presetValuesSchema = z
  .object({
    framework: z.enum(FRAMEWORKS),
    language: z.enum(LANGUAGES),
    styling: z.enum(STYLINGS),
    eslint: z.boolean(),
    prettier: z.boolean(),
    git: z.boolean(),
    install: z.boolean().optional(),
  })
  .strict();

export type PresetValues = z.infer<typeof presetValuesSchema>;

/** One preset row. `values` is validated by `assertKnownPreset` on lookup. */
export interface Preset {
  /** CLI/prompt identifier, e.g. "blog". */
  readonly id: string;
  /** Human label shown in the picker and help. */
  readonly label: string;
  /** One-line description of who the preset is for. */
  readonly description: string;
  readonly values: PresetValues;
}

/**
 * The preset registry. Ordered — the interactive picker shows this order.
 * Values are verified once by `assertKnownPreset`; unknown preset ids fail
 * fast with a readable error.
 */
export const PRESETS: readonly Preset[] = [
  {
    id: "blog",
    label: "Blog",
    description: "content-focused site with Tailwind and full tooling",
    values: {
      framework: "next",
      language: "typescript",
      styling: "tailwind",
      eslint: true,
      prettier: true,
      git: true,
      install: true,
    },
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "data-heavy app UI with Tailwind and full tooling",
    values: {
      framework: "react",
      language: "typescript",
      styling: "tailwind",
      eslint: true,
      prettier: true,
      git: true,
      install: true,
    },
  },
  {
    id: "landing-page",
    label: "Landing page",
    description: "single marketing page with Tailwind, minimal tooling",
    values: {
      framework: "react",
      language: "typescript",
      styling: "tailwind",
      eslint: false,
      prettier: false,
      git: true,
      install: false,
    },
  },
];

/** Look up a preset by id, failing fast with a readable error. */
export function assertKnownPreset(id: string): Preset {
  const preset = PRESETS.find((candidate) => candidate.id === id);
  if (preset === undefined) {
    throw new ValidationError(`Unknown preset "${id}".`, {
      hint: `Supported presets: ${PRESETS.map((candidate) => candidate.id).join(", ")}.`,
    });
  }
  return preset;
}

/** True when the id is a known preset (for flag validation paths). */
export function isKnownPreset(id: string): boolean {
  return PRESETS.some((candidate) => candidate.id === id);
}

/**
 * Expand a preset into a Partial<ProjectConfig>, honoring the documented
 * precedence: flags (already present in `partial`) win over preset values.
 * Only fields the preset declares are filled; a undefined preset (no preset
 * chosen) returns the input unchanged.
 */
export function expandPreset(
  preset: Preset | undefined,
  partial: Partial<ProjectConfig>,
): Partial<ProjectConfig> {
  if (preset === undefined) return partial;
  const expanded: Partial<ProjectConfig> = { ...partial };
  const values = preset.values;
  expanded.framework ??= values.framework;
  expanded.language ??= values.language;
  expanded.styling ??= values.styling;
  expanded.eslint ??= values.eslint;
  expanded.prettier ??= values.prettier;
  expanded.git ??= values.git;
  expanded.install ??= values.install;
  // Drop undefined so downstream prompt logic sees only real values.
  for (const key of Object.keys(expanded) as (keyof ProjectConfig)[]) {
    if (expanded[key] === undefined) delete expanded[key];
  }
  return expanded;
}

/**
 * Resolve the effective preset for a create run: an explicit flag wins, then
 * the interactive/global choice, otherwise undefined (no preset).
 */
export function resolvePreset(
  flagPreset: string | undefined,
  globalPreset: string | undefined,
): Preset | undefined {
  const id = flagPreset ?? globalPreset;
  return id === undefined ? undefined : assertKnownPreset(id);
}
