import * as p from "@clack/prompts";
import { FRAMEWORKS, LANGUAGES, STYLINGS, type PackageManager } from "../types.js";
import { FRAMEWORK_LABELS } from "../templates/shared/labels.js";
import { PRESETS, type PresetValues } from "../config/presets.js";
import { EnvironmentError } from "../utils/errors.js";
import { validateProjectName } from "../utils/name-validation.js";

/**
 * Interactive configuration flow built on @clack/prompts. Only asks for
 * values not already provided by flags or the global config file. Every
 * prompt is cancellable; cancellation exits with code 130.
 */

function optionize<T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): { value: T; label: string }[] {
  return values.map((value) => ({ value, label: labels[value] ?? value }));
}

const LANGUAGE_LABELS: Record<(typeof LANGUAGES)[number], string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
};

const STYLING_LABELS: Record<(typeof STYLINGS)[number], string> = {
  tailwind: "Tailwind CSS v4",
  "css-modules": "CSS Modules",
  plain: "Plain CSS",
};

const PM_LABELS: Record<PackageManager, string> = {
  pnpm: "pnpm",
  npm: "npm",
  yarn: "yarn",
  bun: "bun",
};

export interface PromptAnswers {
  projectName: string;
  framework: (typeof FRAMEWORKS)[number];
  language: (typeof LANGUAGES)[number];
  styling: (typeof STYLINGS)[number];
  packageManager: PackageManager;
  eslint: boolean;
  prettier: boolean;
  git: boolean;
  install: boolean;
}

/** Run the interactive flow for anything not present in `partial`. */
export async function promptForMissing(
  partial: Partial<PromptAnswers> & { preset?: string },
  availableManagers: readonly PackageManager[],
): Promise<PromptAnswers> {
  const answers: Partial<PromptAnswers> & { preset?: string } = { ...partial };

  if (answers.projectName === undefined) {
    const result = await p.text({
      message: "Project name",
      placeholder: "my-app",
      validate: (value) => {
        const check = validateProjectName(String(value ?? ""));
        if (!check.ok) return check.error ?? "Invalid project name.";
        return undefined;
      },
    });
    if (p.isCancel(result)) throw cancel();
    answers.projectName = result.trim();
  }

  // ---- Starting point (preset) ---------------------------------------
  // Shown at the top of the flow unless a preset was already resolved from
  // flags or global config. "Custom" skips the bundle and asks the normal
  // questions; a preset fills framework/language/styling/extras at once and
  // only the package manager is still asked (it is machine-specific).
  if (answers.preset === undefined) {
    const presetChoice = await p.select({
      message: "Starting point",
      options: [
        ...PRESETS.map((preset) => ({
          value: preset.id,
          label: preset.label,
          hint: preset.description,
        })),
        { value: "custom", label: "Custom", hint: "choose each option yourself" },
      ],
    });
    if (p.isCancel(presetChoice)) throw cancel();

    if (presetChoice === "custom") {
      // No preset: fall through to the individual questions below.
    } else {
      answers.preset = presetChoice;
      const values = PRESETS.find((preset) => preset.id === presetChoice)?.values as PresetValues;
      answers.framework ??= values.framework;
      answers.language ??= values.language;
      answers.styling ??= values.styling;
      answers.eslint ??= values.eslint;
      answers.prettier ??= values.prettier;
      answers.git ??= values.git;
      answers.install ??= values.install;
    }
  }

  if (answers.framework === undefined) {
    const result = await p.select({
      message: "Choose framework",
      options: optionize(FRAMEWORKS, FRAMEWORK_LABELS),
    });
    if (p.isCancel(result)) throw cancel();
    answers.framework = result;
  }

  if (answers.language === undefined) {
    const result = await p.select({
      message: "Choose language",
      options: optionize(LANGUAGES, LANGUAGE_LABELS),
    });
    if (p.isCancel(result)) throw cancel();
    answers.language = result;
  }

  if (answers.styling === undefined) {
    const result = await p.select({
      message: "Choose styling",
      options: optionize(STYLINGS, STYLING_LABELS),
    });
    if (p.isCancel(result)) throw cancel();
    answers.styling = result;
  }

  if (answers.packageManager === undefined) {
    if (availableManagers.length === 0) {
      throw new EnvironmentError("No supported package manager found on PATH.", {
        hint: "Install Node.js (includes npm) from https://nodejs.org, or install pnpm/yarn/bun.",
      });
    }
    const result = await p.select({
      message: "Choose package manager",
      options: optionize(availableManagers, PM_LABELS),
    });
    if (p.isCancel(result)) throw cancel();
    answers.packageManager = result;
  }

  answers.eslint = await confirmOr(answers.eslint, "Add ESLint?");
  answers.prettier = await confirmOr(answers.prettier, "Add Prettier?");
  answers.git = await confirmOr(answers.git, "Initialize a Git repository?");
  answers.install = await confirmOr(answers.install, "Install dependencies now?");

  return answers as PromptAnswers;
}

async function confirmOr(existing: boolean | undefined, message: string): Promise<boolean> {
  if (existing !== undefined) return existing;
  const result = await p.confirm({ message, initialValue: true });
  if (p.isCancel(result)) throw cancel();
  return result;
}

export class PromptCancelled extends Error {
  constructor() {
    super("Prompt cancelled by user.");
  }
}

function cancel(): PromptCancelled {
  return new PromptCancelled();
}
