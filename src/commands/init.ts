import * as p from "@clack/prompts";
import { globalConfigSchema, saveGlobalConfig, loadGlobalConfig } from "../config/global-config.js";
import { LANGUAGES, PACKAGE_MANAGERS, STYLINGS } from "../types.js";
import { frameworkLabels } from "../templates/shared/labels.js";
import { PromptCancelled } from "../prompts/create-prompts.js";
import { detectAvailableManagers } from "../services/package-manager.js";
import { logger } from "../utils/logger.js";

/**
 * `frontend-starter init` — capture personal defaults into the global config
 * so future `create` runs prompt less. Never stores secrets; only choices.
 */

export async function runInit(): Promise<number> {
  p.intro("frontend-starter init");

  const existing = loadGlobalConfig();
  const available = await detectAvailableManagers(existing.detectionOrder);

  const framework = await p.select({
    message: "Default framework",
    options: frameworkLabels(),
  });
  if (p.isCancel(framework)) throw new PromptCancelled();

  const language = await p.select({
    message: "Default language",
    options: LANGUAGES.map((l) => ({
      value: l,
      label: l === "typescript" ? "TypeScript" : "JavaScript",
    })),
  });
  if (p.isCancel(language)) throw new PromptCancelled();

  const styling = await p.select({
    message: "Default styling",
    options: STYLINGS.map((s) => ({
      value: s,
      label:
        s === "tailwind" ? "Tailwind CSS v4" : s === "css-modules" ? "CSS Modules" : "Plain CSS",
    })),
  });
  if (p.isCancel(styling)) throw new PromptCancelled();

  const packageManager = await p.select({
    message: "Default package manager",
    options: (available.length > 0 ? available : [...PACKAGE_MANAGERS]).map((pm) => ({
      value: pm,
      label: pm,
    })),
  });
  if (p.isCancel(packageManager)) throw new PromptCancelled();

  const eslint = await p.confirm({
    message: "Add ESLint by default?",
    initialValue: existing.eslint ?? true,
  });
  if (p.isCancel(eslint)) throw new PromptCancelled();
  const prettier = await p.confirm({
    message: "Add Prettier by default?",
    initialValue: existing.prettier ?? true,
  });
  if (p.isCancel(prettier)) throw new PromptCancelled();
  const git = await p.confirm({
    message: "Initialize Git by default?",
    initialValue: existing.git ?? true,
  });
  if (p.isCancel(git)) throw new PromptCancelled();
  const install = await p.confirm({
    message: "Install dependencies by default?",
    initialValue: existing.install ?? true,
  });
  if (p.isCancel(install)) throw new PromptCancelled();

  const config = globalConfigSchema.parse({
    ...existing,
    framework,
    language,
    styling,
    packageManager,
    eslint,
    prettier,
    git,
    install,
  });
  const savedPath = saveGlobalConfig(config);
  p.outro(`Defaults saved to ${savedPath}`);
  logger.detail(`config dir override: FRONTEND_STARTER_CONFIG_DIR`);
  return 0;
}
