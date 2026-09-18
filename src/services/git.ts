import { run, runRequired } from "../utils/exec.js";
import { PostTaskError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

/**
 * Git support: availability probe and repository initialization. Git is
 * optional — when missing, project generation still succeeds and the user is
 * told how to initialize later.
 */

export async function gitAvailable(): Promise<boolean> {
  try {
    const result = await run("git", ["--version"]);
    return !result.failed;
  } catch {
    return false;
  }
}

/** Initialize a git repository with an initial commit. Returns true on success. */
export async function initGitRepo(projectDir: string): Promise<boolean> {
  try {
    // Prefer `main` as the initial branch; fall back for ancient git versions.
    const initResult = await run("git", ["init", "-b", "main"], { cwd: projectDir });
    if (initResult.failed) {
      await runRequired("git", ["init"], {
        cwd: projectDir,
        hint: "Initialize manually later with: git init",
      });
    }
    await runRequired("git", ["add", "."], {
      cwd: projectDir,
      hint: "Stage manually later with: git add .",
    });
    await runRequired("git", ["commit", "-m", "chore: initial commit by frontend-starter"], {
      cwd: projectDir,
      describeFailure: (result) => {
        const output = `${result.stderr}\n${result.stdout}`.toLowerCase();
        if (output.includes("please tell me who you are") || output.includes("user.email")) {
          return "git user.name / user.email are not configured.";
        }
        return result.stderr.trim() || `exit code ${result.exitCode}`;
      },
      hint: 'Set your identity with:\n  git config --global user.name "Your Name"\n  git config --global user.email "you@example.com"\nThen commit with:\n  git add . && git commit -m "initial commit"',
    });
    return true;
  } catch (error) {
    if (error instanceof PostTaskError) {
      logger.warn(
        `Git initialization incomplete: ${error.message.split(":").slice(1).join(":").trim() || error.message}`,
      );
      logger.warn("The project files are ready — commit manually once git is configured.");
      return false;
    }
    throw error;
  }
}
