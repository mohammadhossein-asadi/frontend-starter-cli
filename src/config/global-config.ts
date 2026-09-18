import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { FRAMEWORKS, LANGUAGES, PACKAGE_MANAGERS, STYLINGS, type ProjectConfig } from "../types.js";
import { logger } from "../utils/logger.js";
import { configFilePath } from "../utils/paths.js";

/**
 * Global configuration model (~/<platform config dir>/frontend-starter/config.json).
 * Stores only non-sensitive defaults. The file is optional; everything here
 * can be overridden by CLI flags, and anything still missing is prompted for.
 */

export const globalConfigSchema = z
  .object({
    packageManager: z.enum(PACKAGE_MANAGERS).optional(),
    framework: z.enum(FRAMEWORKS).optional(),
    language: z.enum(LANGUAGES).optional(),
    styling: z.enum(STYLINGS).optional(),
    eslint: z.boolean().optional(),
    prettier: z.boolean().optional(),
    git: z.boolean().optional(),
    install: z.boolean().optional(),
    /** Preferred package-manager detection order. */
    detectionOrder: z.array(z.enum(PACKAGE_MANAGERS)).optional(),
  })
  .strict();

export type GlobalConfig = z.infer<typeof globalConfigSchema>;

/** Load the global config, returning {} for missing or unreadable files. */
export function loadGlobalConfig(filePath: string = configFilePath()): GlobalConfig {
  if (!existsSync(filePath)) return {};
  try {
    const raw: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    const parsed = globalConfigSchema.safeParse(raw);
    if (!parsed.success) {
      logger.warn(`Ignoring invalid global config at ${filePath} (schema mismatch).`);
      return {};
    }
    return parsed.data;
  } catch (error) {
    logger.warn(
      `Could not read global config at ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {};
  }
}

/** Save the global config, creating the directory if needed. Returns the path. */
export function saveGlobalConfig(
  config: GlobalConfig,
  filePath: string = configFilePath(),
): string {
  const parsed = globalConfigSchema.parse(config);
  const dir = filePath.slice(0, Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\")));
  if (dir) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  return filePath;
}

/** Merge CLI flags (highest) over global config (lowest). Prompt fills the rest. */
export function mergeWithGlobalConfig(
  flags: Partial<ProjectConfig>,
  global: GlobalConfig,
): Partial<ProjectConfig> {
  const merged: Partial<ProjectConfig> = {
    framework: flags.framework ?? global.framework,
    language: flags.language ?? global.language,
    styling: flags.styling ?? global.styling,
    packageManager: flags.packageManager ?? global.packageManager,
    eslint: flags.eslint ?? global.eslint,
    prettier: flags.prettier ?? global.prettier,
    git: flags.git ?? global.git,
    install: flags.install ?? global.install,
    force: flags.force,
  };
  // Drop undefined entries so prompts can detect what is truly missing.
  for (const key of Object.keys(merged) as (keyof ProjectConfig)[]) {
    if (merged[key] === undefined) delete merged[key];
  }
  return merged;
}
