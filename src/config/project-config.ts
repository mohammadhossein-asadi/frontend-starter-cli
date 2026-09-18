import { z } from "zod";
import { FRAMEWORKS, LANGUAGES, PACKAGE_MANAGERS, STYLINGS, type ProjectConfig } from "../types.js";
import { ValidationError } from "../utils/errors.js";

/**
 * The complete, validated project configuration. This is the single source of
 * truth passed from the `create` command into the template resolver.
 */

export const projectConfigSchema = z.object({
  projectName: z.string().min(1),
  framework: z.enum(FRAMEWORKS),
  language: z.enum(LANGUAGES),
  styling: z.enum(STYLINGS),
  packageManager: z.enum(PACKAGE_MANAGERS),
  eslint: z.boolean(),
  prettier: z.boolean(),
  git: z.boolean(),
  install: z.boolean(),
  force: z.boolean(),
});

/** Validate a complete ProjectConfig, throwing a readable ValidationError. */
export function assertValidConfig(config: unknown): ProjectConfig {
  const parsed = projectConfigSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ValidationError(`Invalid project configuration: ${issues}`);
  }
  return parsed.data;
}
