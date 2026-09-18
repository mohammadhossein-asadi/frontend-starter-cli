import { PACKAGE_MANAGERS, type PackageManager } from "../types.js";
import { run, runRequired } from "../utils/exec.js";
import { EnvironmentError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

/**
 * Package-manager detection (PATH + version probe) and installation.
 * Detection order is configurable via global config; the default favors
 * pnpm > npm > yarn > bun. The CLI never installs a package manager itself.
 */

export const DEFAULT_DETECTION_ORDER: readonly PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

const INSTALL_ARGS: Record<PackageManager, readonly string[]> = {
  pnpm: ["install"],
  npm: ["install"],
  yarn: ["install"],
  bun: ["install"],
};

/**
 * Probe PATH for each manager in the given order and return the installed
 * ones, preserving order. Used for prompts and non-interactive fallback.
 */
export async function detectAvailableManagers(
  order?: readonly PackageManager[],
): Promise<PackageManager[]> {
  const sequence = order ?? DEFAULT_DETECTION_ORDER;
  const unique = [...new Set(sequence)].filter((pm) =>
    (PACKAGE_MANAGERS as readonly string[]).includes(pm),
  );
  const available: PackageManager[] = [];
  for (const pm of unique) {
    if ((await detectPackageManager(pm)) !== null) available.push(pm);
  }
  return available;
}

/** Probe PATH for a package manager, returning its version or null. */
export async function detectPackageManager(pm: PackageManager): Promise<string | null> {
  try {
    const result = await run(pm, ["--version"]);
    if (result.failed) return null;
    const line = (result.stdout || result.stderr).trim().split("\n")[0] ?? "";
    return line || null;
  } catch {
    return null;
  }
}

/** Validate a user-provided package manager choice, with install hints. */
export function assertKnownPackageManager(value: string): PackageManager {
  if ((PACKAGE_MANAGERS as readonly string[]).includes(value)) {
    return value as PackageManager;
  }
  throw new EnvironmentError(`"${value}" is not a supported package manager.`, {
    hint: `Supported: ${PACKAGE_MANAGERS.join(", ")}.`,
  });
}

/** Error thrown when the selected package manager is not installed. */
export function missingPackageManagerError(
  pm: PackageManager,
  projectName?: string,
): EnvironmentError {
  const installHints: Record<PackageManager, string> = {
    pnpm: "npm install -g pnpm",
    npm: "npm ships with Node.js — reinstall Node.js from https://nodejs.org",
    yarn: "npm install -g yarn",
    bun: "curl -fsSL https://bun.sh/install | bash  (or: npm install -g bun)",
  };
  const alt = pm === "npm" ? undefined : "npm";
  const suggestion = projectName
    ? `frontend-starter create ${projectName} --package-manager ${alt ?? pm}`
    : undefined;
  return new EnvironmentError(`${pm} was not found.`, {
    hint: `The selected package manager is not installed. Install it (e.g. ${installHints[pm]}) and try again${
      alt ? `, or run with --package-manager ${alt}` : "."
    }`,
    suggestion,
  });
}

/** Run the dependency installation in the project directory. */
export async function installDependencies(pm: PackageManager, projectDir: string): Promise<void> {
  const args = INSTALL_ARGS[pm];
  logger.setSpinning(true);
  try {
    await runRequired(pm, args, {
      cwd: projectDir,
      hint: `You can install dependencies manually later: ${pm === "yarn" ? "yarn" : `${pm} install`}`,
    });
  } finally {
    logger.setSpinning(false);
  }
}
