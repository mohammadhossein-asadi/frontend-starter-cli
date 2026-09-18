import { execa, type Options } from "execa";
import { PostTaskError, toError } from "./errors.js";
import { logger } from "./logger.js";

/**
 * Cross-platform process execution built on execa.
 *
 * Windows notes:
 *  - Since Node 20.12.2, spawning `.cmd`/`.bat` files without `shell: true`
 *    throws EINVAL (CVE-2024-27980 mitigation). npm/pnpm/yarn resolve to
 *    `.cmd` shims (bun is a native .exe), so commands in SHELL_COMMANDS run
 *    through the shell;
 *    execa quotes arguments safely in shell mode.
 *  - Everything else (git, node, …) spawns directly without a shell, so
 *    arguments with spaces (e.g. commit messages) are passed verbatim.
 */
const IS_WINDOWS = process.platform === "win32";
const SHELL_COMMANDS = new Set(["npm", "pnpm", "yarn", "npm.cmd", "pnpm.cmd", "yarn.cmd"]);

function needsShell(file: string): boolean {
  return IS_WINDOWS && SHELL_COMMANDS.has(file);
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  failed: boolean;
}

/**
 * Run a command and resolve with its result. Never throws for non-zero exit
 * codes (callers decide); throws only if the binary cannot be spawned at all.
 */
export async function run(
  file: string,
  args: readonly string[],
  options: { cwd?: string; env?: Record<string, string> } = {},
): Promise<RunResult> {
  const execOptions: Options = {
    cwd: options.cwd,
    env: options.env,
    shell: needsShell(file),
    reject: false,
    windowsHide: true,
  };
  try {
    const result = await execa(file, [...args], execOptions);
    logger.detail(`$ ${file} ${args.join(" ")} → exit ${String(result.exitCode)}`);
    return {
      stdout: typeof result.stdout === "string" ? result.stdout : "",
      stderr: typeof result.stderr === "string" ? result.stderr : "",
      exitCode: typeof result.exitCode === "number" ? result.exitCode : 1,
      failed: result.failed === true,
    };
  } catch (error) {
    // Spawn-level failure (ENOENT, EACCES, EINVAL): normalize, caller handles.
    const err = toError(error);
    logger.detail(`$ ${file} ${args.join(" ")} → spawn failed: ${err.message}`);
    throw err;
  }
}

/**
 * Run a command expecting success; returns stdout. On non-zero exit or spawn
 * failure, throws a PostTaskError with a human-readable message.
 */
export async function runRequired(
  file: string,
  args: readonly string[],
  options: {
    cwd?: string;
    env?: Record<string, string>;
    /** Called with the raw result on failure to build the user message. */
    describeFailure?: (result: RunResult) => string;
    hint?: string;
  } = {},
): Promise<string> {
  const result = await run(file, args, options);
  if (result.failed) {
    const details = options.describeFailure
      ? options.describeFailure(result)
      : result.stderr.trim() || result.stdout.trim() || `exit code ${String(result.exitCode)}`;
    throw new PostTaskError(`"${file} ${args.join(" ")}" failed: ${details}`, {
      hint: options.hint,
    });
  }
  return result.stdout;
}
