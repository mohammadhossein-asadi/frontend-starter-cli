import type { CreateFlags } from "./create.js";

/**
 * Single source of truth for the `create` command's flags.
 *
 * The historic bug class this module eliminates: commander maps kebab-case
 * flags (`--package-manager`, `--dry-run`) onto camelCase option keys, and
 * hand-rolled action bodies that read kebab strings (`opts["package-manager"]`)
 * silently read `undefined`. Every flag is now declared from
 * `CREATE_FLAG_SPECS` and read through `opt()`/`boolFlag()`, which are keyed
 * by the camelCase fields of `CreateFlags` — a typo or a kebab string fails
 * to compile instead of failing at runtime.
 *
 * Commander notes (verified empirically against commander 14):
 *  - Kebab flags land ONLY on the camelCase key; kebab keys never exist.
 *  - `--no-x` declared as its own option sets `x: false`; when absent the key
 *    stays `undefined` (tri-state), which `create` relies on to distinguish
 *    "not provided" from "explicitly disabled".
 *  - The combined `--x, --no-x` syntax is NOT tri-state in commander 14
 *    (positive-first forces `--x` to read `false`; negated-first maps
 *    `--no-x` to `true`). Booleans with negations therefore stay separate
 *    declarations, one positive and one negative.
 */

export type CreateFlagKey = Extract<keyof CreateFlags, string>;

/** Type of `CreateFlags[K]` when read from parsed options (missing = undefined). */
export type CreateFlagValue<K extends CreateFlagKey> =
  NonNullable<CreateFlags[K]> extends boolean ? boolean | undefined : string | undefined;

/** Keys of `CreateFlags` that are boolean flags. */
export type BooleanFlagKey = {
  [K in CreateFlagKey]: NonNullable<CreateFlags[K]> extends boolean ? K : never;
}[CreateFlagKey];

/** One row of the flag table: declaration data plus negation info. */
export interface CreateFlagSpec {
  /** Canonical camelCase key on `CreateFlags`. */
  readonly key: CreateFlagKey;
  /** true → boolean option; false → option taking a value. */
  readonly boolean: boolean;
  /** Commander long flag for the negated boolean, e.g. "--no-eslint". */
  readonly negatedBy?: string;
  readonly description: string;
  /** Description for the negated boolean; defaults to `negated by <flag>`. */
  readonly negatedDescription?: string;
}

/** Convert a camelCase key to its kebab-case CLI form ("dryRun" → "dry-run"). */
export function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/** Commander long flag for a camelCase key ("packageManager" → "--package-manager"). */
export function longFlagOf(key: string): string {
  return `--${toKebab(key)}`;
}

/**
 * Ordered flag table for `create`. Declaring and reading both derive from
 * these rows; adding a flag means adding one row (and its `CreateFlags`
 * field), never a second hand-rolled mapping.
 */
export const CREATE_FLAG_SPECS: readonly CreateFlagSpec[] = [
  {
    key: "preset",
    boolean: false,
    description: "start from a preset: blog | dashboard | landing-page",
  },
  { key: "framework", boolean: false, description: "react | next | vue" },
  { key: "language", boolean: false, description: "typescript | javascript" },
  { key: "typescript", boolean: true, description: "shorthand for --language typescript" },
  { key: "javascript", boolean: true, description: "shorthand for --language javascript" },
  { key: "styling", boolean: false, description: "tailwind | css-modules | plain" },
  { key: "tailwind", boolean: true, description: "shorthand for --styling tailwind" },
  { key: "packageManager", boolean: false, description: "pnpm | npm | yarn | bun" },
  { key: "eslint", boolean: true, negatedBy: "--no-eslint", description: "add ESLint" },
  { key: "prettier", boolean: true, negatedBy: "--no-prettier", description: "add Prettier" },
  {
    key: "git",
    boolean: true,
    negatedBy: "--no-git",
    description: "initialize a Git repository",
  },
  {
    key: "install",
    boolean: true,
    negatedBy: "--no-install",
    description: "install dependencies after generation",
  },
  {
    key: "force",
    boolean: true,
    description: "overwrite files in an existing non-empty directory",
  },
  {
    key: "dryRun",
    boolean: true,
    description: "preview the generated files without writing anything",
  },
  {
    key: "yes",
    boolean: true,
    description: "non-interactive; fail instead of prompting for missing options",
  },
];

/** Declare every create flag on a commander command, in table order. */
export function declareCreateFlags(command: {
  option: (flags: string, description?: string) => unknown;
}): void {
  for (const spec of CREATE_FLAG_SPECS) {
    const flag = longFlagOf(spec.key);
    if (spec.boolean) {
      command.option(flag, spec.description);
      if (spec.negatedBy !== undefined) {
        command.option(spec.negatedBy, spec.negatedDescription ?? `negated by ${spec.negatedBy}`);
      }
    } else {
      command.option(`${flag} <${toKebab(spec.key)}>`, spec.description);
    }
  }
}

/**
 * Read a parsed option by its canonical camelCase key. The undefined-check
 * makes the internal cast safe: every other value shape is a commander bug,
 * not something callers should handle.
 */
export function opt<K extends CreateFlagKey>(
  opts: Record<string, unknown>,
  key: K,
): CreateFlagValue<K> {
  const value = opts[key];
  if (value === undefined) return undefined;
  return value as CreateFlagValue<K>;
}

/**
 * Read a boolean option tri-state: true/false when explicitly passed
 * (including via --no-), undefined when absent — so an omitted flag still
 * falls back to global config and prompts instead of force-disabling.
 */
export function boolFlag(opts: Record<string, unknown>, key: BooleanFlagKey): boolean | undefined {
  const value = opts[key];
  if (value === true) return true;
  if (value === false) return false;
  return undefined;
}

/**
 * Map parsed commander options onto `CreateFlags`. This is the ONLY place
 * where CLI options become typed flags.
 */
export function parseCreateFlags(opts: Record<string, unknown>, globalYes: boolean): CreateFlags {
  return {
    preset: opt(opts, "preset"),
    framework: opt(opts, "framework"),
    language: opt(opts, "language") as CreateFlags["language"],
    typescript: boolFlag(opts, "typescript"),
    javascript: boolFlag(opts, "javascript"),
    styling: opt(opts, "styling"),
    tailwind: boolFlag(opts, "tailwind"),
    packageManager: opt(opts, "packageManager"),
    eslint: boolFlag(opts, "eslint"),
    prettier: boolFlag(opts, "prettier"),
    git: boolFlag(opts, "git"),
    install: boolFlag(opts, "install"),
    force: boolFlag(opts, "force"),
    dryRun: boolFlag(opts, "dryRun"),
    yes: boolFlag(opts, "yes") || globalYes,
  };
}
