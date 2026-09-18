import { existsSync, readdirSync, statSync } from "node:fs";
import * as p from "@clack/prompts";
import { assertValidConfig } from "../config/project-config.js";
import {
  loadGlobalConfig,
  mergeWithGlobalConfig,
  type GlobalConfig,
} from "../config/global-config.js";
import { expandPreset, resolvePreset } from "../config/presets.js";
import { resolveTemplate } from "../templates/registry.js";
import { generateFiles } from "../generator/generator.js";
import { resolveTargetDir } from "../utils/paths.js";
import { assertValidProjectName, validateProjectName } from "../utils/name-validation.js";
import { EnvironmentError, TargetDirectoryError, ValidationError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import {
  EXIT_CODES,
  FRAMEWORKS,
  type PackageManager,
  type ProjectConfig,
  type ResolvedTemplate,
} from "../types.js";
import { promptForMissing, PromptCancelled } from "../prompts/create-prompts.js";
import {
  assertKnownPackageManager,
  detectAvailableManagers,
  detectPackageManager,
  installDependencies,
  missingPackageManagerError,
} from "../services/package-manager.js";
import { gitAvailable, initGitRepo } from "../services/git.js";

/**
 * `create` command: the full Choose → Configure → Generate → Install → Run
 * pipeline. Non-interactive when every required value arrives via flags or
 * global config, or when stdin is not a TTY (or --yes is passed).
 */

export interface CreateFlags {
  preset?: string;
  framework?: string;
  language?: "typescript" | "javascript";
  styling?: string;
  packageManager?: string;
  typescript?: boolean;
  javascript?: boolean;
  tailwind?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  git?: boolean;
  install?: boolean;
  force?: boolean;
  dryRun?: boolean;
  yes?: boolean;
}

/** Entry point for `frontend-starter create [name]` (and the bare default run). */
export async function runCreate(
  projectNameArg: string | undefined,
  flags: CreateFlags,
): Promise<number> {
  p.intro("frontend-starter");

  const interactive = isInteractive(flags.yes === true);
  const global = loadGlobalConfigSafe();

  // ---- 1. Project name from argument (validated + normalized) ---------
  const projectName =
    projectNameArg !== undefined ? assertValidProjectName(projectNameArg) : undefined;

  // ---- 2. Flags → preset → partial config, merged over global config --
  // Precedence: flags > preset > global config > prompts > defaults. The
  // preset never overrides an explicit flag, so `--preset blog --framework
  // vue` yields Vue with the blog's styling and extras.
  const preset = resolvePreset(flags.preset, global.preset);
  if (preset !== undefined) {
    logger.step(`Starting point: ${preset.label}`);
  }
  const partial = expandPreset(preset, mergeWithGlobalConfig(flagsToPartialConfig(flags), global));

  // ---- 3. Package-manager resolution ----------------------------------
  // Explicit choice (flag or global config) must exist on PATH. Otherwise
  // detect what is available: the list feeds the interactive prompt, and the
  // first hit becomes the non-interactive default.
  let pmChoices: PackageManager[] = [];
  if (partial.packageManager !== undefined) {
    const version = await detectPackageManager(partial.packageManager);
    if (version === null) {
      throw missingPackageManagerError(partial.packageManager, projectName);
    }
  } else {
    pmChoices = await detectAvailableManagers(global.detectionOrder);
    if (!interactive) {
      const fallback = pmChoices[0];
      if (fallback === undefined) {
        throw new EnvironmentError("No supported package manager was found on PATH.", {
          hint: "Install Node.js (includes npm) from https://nodejs.org, or install pnpm/yarn/bun.",
        });
      }
      partial.packageManager = fallback;
    }
  }

  // ---- 4. Non-interactive completeness gate ---------------------------
  if (!interactive) {
    // Booleans get CI-friendly defaults so partial flag sets still work:
    // linting/formatting/git default on (matching interactive defaults),
    // installation defaults off (no surprise network activity).
    partial.eslint ??= true;
    partial.prettier ??= true;
    partial.git ??= true;
    partial.install ??= false;
    if (projectName === undefined || !hasAllRequired(partial)) {
      throw new ValidationError("Non-interactive mode requires all core options to be provided.", {
        hint:
          "Pass a project name plus --framework, --typescript|--javascript, --styling and " +
          "--package-manager (eslint/prettier/git default to on, install to off), " +
          "or run interactively without --yes.",
      });
    }
  }

  // ---- 5. Prompts (interactive only) ----------------------------------
  let config: ProjectConfig;
  if (interactive) {
    const answers = await promptForMissing({ ...partial, projectName }, pmChoices);
    const name = assertValidProjectName(answers.projectName);
    config = assertValidConfig({ ...answers, projectName: name, force: flags.force === true });
  } else {
    config = assertValidConfig({
      ...partial,
      projectName: projectName as string,
      force: flags.force === true,
    });
  }

  // ---- 6. Target directory + existing-directory safety ----------------
  const target = await resolveTargetWithConflictCheck(
    config,
    flags.force === true,
    interactive,
    flags.dryRun === true,
  );
  config = { ...config, projectName: target.projectName, force: target.force };

  // ---- 7. Dry run (preview only) ---------------------------------------
  if (flags.dryRun === true) {
    renderDryRun(resolveTemplate(config), target.dir);
    return EXIT_CODES.ok;
  }

  // ---- 8. Generate -----------------------------------------------------
  const resolved = resolveTemplate(config);
  const fileCount = generateFiles(resolved, target.dir);
  p.log.success(`Project files generated (${String(fileCount)} files).`);

  // ---- 8. Post-generation tasks ----------------------------------------
  let installOk = true;
  let gitOk = true;

  if (config.install) {
    const pmVersion = await detectPackageManager(config.packageManager);
    if (pmVersion === null) {
      logger.warn(`"${config.packageManager}" disappeared before installation could start.`);
      logger.warn(manualInstallHint(config));
      installOk = false;
    } else {
      const spinner = p.spinner();
      spinner.start(`Installing dependencies with ${config.packageManager}…`);
      try {
        await installDependencies(config.packageManager, target.dir);
        spinner.stop("Dependencies installed.");
      } catch {
        spinner.stop("Dependency installation failed.");
        logger.warn(manualInstallHint(config));
        installOk = false;
      }
    }
  }

  if (config.git) {
    if (await gitAvailable()) {
      const spinner = p.spinner();
      spinner.start("Initializing Git repository…");
      const ok = await initGitRepo(target.dir);
      if (ok) {
        spinner.stop("Git repository initialized.");
      } else {
        spinner.stop("Git initialized, but the initial commit needs attention.");
      }
      gitOk = ok;
    } else {
      logger.warn("Git was not found; skipping repository initialization.");
      logger.warn(
        'Initialize manually later: git init && git add . && git commit -m "initial commit"',
      );
      gitOk = false;
    }
  }

  // ---- 9. Summary -------------------------------------------------------
  renderSummary(config, target.dir);

  return installOk && gitOk ? EXIT_CODES.ok : EXIT_CODES.postTaskFailed;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function isInteractive(yesFlag: boolean): boolean {
  if (yesFlag) return false;
  return Boolean(process.stdout.isTTY) && Boolean(process.stdin.isTTY);
}

function loadGlobalConfigSafe(): GlobalConfig {
  try {
    return loadGlobalConfig();
  } catch {
    return {};
  }
}

function flagsToPartialConfig(flags: CreateFlags): Partial<ProjectConfig> {
  // Language: explicit --language wins, then the --typescript/--javascript shorthands.
  const language =
    flags.language ??
    (flags.typescript === true ? "typescript" : undefined) ??
    (flags.javascript === true ? "javascript" : undefined);
  if (flags.typescript === true && flags.javascript === true) {
    throw new ValidationError("Use either --typescript or --javascript, not both.");
  }

  // Framework validation with a helpful message.
  let framework: ProjectConfig["framework"] | undefined;
  if (flags.framework !== undefined) {
    if (!(FRAMEWORKS as readonly string[]).includes(flags.framework)) {
      throw new ValidationError(`Unknown framework "${flags.framework}".`, {
        hint: `Supported frameworks: ${FRAMEWORKS.join(", ")}.`,
      });
    }
    framework = flags.framework as ProjectConfig["framework"];
  }

  // Styling: --tailwind is a shorthand for --styling tailwind.
  let styling: ProjectConfig["styling"] | undefined;
  if (flags.tailwind === true && flags.styling !== undefined && flags.styling !== "tailwind") {
    throw new ValidationError("--tailwind and --styling conflict; use one of them.");
  }
  const stylingRaw = flags.tailwind === true ? "tailwind" : flags.styling;
  if (stylingRaw !== undefined) {
    if (stylingRaw !== "tailwind" && stylingRaw !== "css-modules" && stylingRaw !== "plain") {
      throw new ValidationError(`Unknown styling "${stylingRaw}".`, {
        hint: "Supported styles: tailwind, css-modules, plain.",
      });
    }
    styling = stylingRaw;
  }

  return {
    framework,
    language,
    styling,
    packageManager:
      flags.packageManager !== undefined
        ? assertKnownPackageManager(flags.packageManager)
        : undefined,
    eslint: flags.eslint,
    prettier: flags.prettier,
    git: flags.git,
    install: flags.install,
    force: flags.force,
  };
}

function hasAllRequired(partial: Partial<ProjectConfig>): boolean {
  return (
    partial.framework !== undefined &&
    partial.language !== undefined &&
    partial.styling !== undefined &&
    partial.packageManager !== undefined
  );
}

interface TargetResolution {
  projectName: string;
  dir: string;
  force: boolean;
}

/**
 * Ensure the target directory can be used. Interactive conflicts offer
 * cancel / rename / overwrite; overwrite requires an explicit confirmation.
 * Non-interactive conflicts fail unless --force was passed.
 */
async function resolveTargetWithConflictCheck(
  config: ProjectConfig,
  forceFlag: boolean,
  interactive: boolean,
  dryRun = false,
): Promise<TargetResolution> {
  let projectName = config.projectName;
  let force = forceFlag;
  let dir = resolveTargetDir(projectName);

  for (;;) {
    if (!existsSync(dir)) return { projectName, dir, force };
    if (!statSync(dir).isDirectory()) {
      throw new TargetDirectoryError(
        `Path "${projectName}" already exists and is not a directory.`,
        { hint: "Remove or rename the file, or choose another project name." },
      );
    }
    const entries = readdirSync(dir);
    if (entries.length === 0 || force) return { projectName, dir, force };

    if (dryRun) {
      logger.warn(
        `Directory "${projectName}" already exists and is not empty — a real run would require --force or a new name.`,
      );
      return { projectName, dir, force };
    }

    if (!interactive) {
      throw new TargetDirectoryError(
        `Directory "${projectName}" already exists and is not empty.`,
        { hint: "Re-run with --force to overwrite, or choose another name." },
      );
    }

    const choice = await p.select({
      message: `Directory "${projectName}" already exists and is not empty.`,
      options: [
        { value: "cancel", label: "Cancel" },
        { value: "rename", label: "Use another name" },
        { value: "overwrite", label: "Continue and overwrite" },
      ],
    });
    if (p.isCancel(choice) || choice === "cancel") throw new PromptCancelled();

    if (choice === "rename") {
      const next = await p.text({
        message: "New project name",
        validate: (value) => {
          const check = validateProjectName(String(value ?? ""));
          return check.ok ? undefined : (check.error ?? "Invalid project name.");
        },
      });
      if (p.isCancel(next)) throw new PromptCancelled();
      projectName = assertValidProjectName(String(next));
      dir = resolveTargetDir(projectName);
      continue;
    }

    // choice === "overwrite" — destructive, so confirm explicitly.
    const confirmed = await p.confirm({
      message: `Overwrite files inside "${projectName}"? Existing files may be replaced.`,
      initialValue: false,
    });
    if (p.isCancel(confirmed) || !confirmed) throw new PromptCancelled();
    force = true;
  }
}

function manualInstallHint(config: ProjectConfig): string {
  const install = config.packageManager === "yarn" ? "yarn" : `${config.packageManager} install`;
  return [
    "You can install dependencies manually:",
    "",
    `  cd ${config.projectName}`,
    `  ${install}`,
    "",
  ].join("\n");
}

/**
 * Render a dry-run preview: the full file tree the generator would write,
 * plus the package.json that would be produced. Nothing touches the disk.
 */
function renderDryRun(resolved: ResolvedTemplate, dir: string): void {
  const paths = Object.keys(resolved.files).sort();
  const dirs = new Set<string>();
  for (const filePath of paths) {
    const segments = filePath.split("/");
    for (let i = 1; i < segments.length; i++) {
      dirs.add(segments.slice(0, i).join("/"));
    }
  }

  const rootName = dir.split(/[\\/]/).pop() ?? dir;
  const lines: string[] = [
    "Dry run - no files were written.",
    "",
    `Would create ${dir}:`,
    "",
    `${String(paths.length)} files in ${String(dirs.size + 1)} directories:`,
    "",
    `  ${rootName}/`,
  ];
  for (const d of [...dirs].sort()) {
    lines.push("  ".repeat(d.split("/").length) + d.split("/").pop() + "/");
  }
  for (const filePath of paths) {
    const depth = filePath.split("/").length;
    lines.push("  ".repeat(depth) + filePath.split("/").pop());
  }

  const packageJson = resolved.files["package.json"];
  if (packageJson !== undefined) {
    lines.push("");
    lines.push("package.json would contain:");
    lines.push("");
    for (const line of packageJson.split("\n")) {
      lines.push("  " + line);
    }
  }

  logger.print(lines.join("\n"));
  p.outro("Dry run complete. Re-run without --dry-run to generate.");
}

function renderSummary(config: ProjectConfig, dir: string): void {
  const pm = config.packageManager;
  const dev = pm === "npm" ? "npm run dev" : pm === "bun" ? "bun run dev" : `${pm} dev`;
  const lines = [
    "Your project is ready.",
    "",
    "Next steps:",
    "",
    `  cd ${config.projectName}`,
    `  ${dev}`,
    "",
    "Happy coding 🚀",
  ];
  p.outro(lines.join("\n"));
  logger.final(`Created ${config.projectName} at ${dir}`);
}
