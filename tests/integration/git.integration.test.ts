import { afterAll, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";

/**
 * End-to-end test for the git post-generation task: a create run with git
 * enabled must initialize a repository on `main` and land an initial commit.
 * Skipped when git itself is unavailable in the test environment.
 */

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CLI = path.join(projectRoot, "bin", "frontend-starter.js");
const env = {
  ...process.env,
  FRONTEND_STARTER_CONFIG_DIR: path.join(tmpdir(), `fsc-git-${process.pid}`),
};

const dirs: string[] = [];
function tempWorkdir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "fsc-git-"));
  dirs.push(dir);
  return dir;
}

afterAll(() => {
  for (const dir of dirs) {
    rmSync(dir, { recursive: true, force: true });
  }
});

let gitUsable = false;
try {
  const probe = await execa("git", ["--version"], { reject: false });
  gitUsable = probe.exitCode === 0;
} catch {
  gitUsable = false;
}

describe("create --git (end-to-end)", () => {
  it.skipIf(!gitUsable)(
    "initializes a repository and lands an initial commit on main",
    async () => {
      const cwd = tempWorkdir();
      const result = await execa(
        "node",
        [
          CLI,
          "create",
          "git-app",
          "--framework",
          "react",
          "--typescript",
          "--tailwind",
          "--package-manager",
          "npm",
          "--git",
          "--no-install",
          "--yes",
        ],
        {
          cwd,
          env: {
            ...env,
            // Deterministic authorship for the initial commit.
            GIT_AUTHOR_NAME: "Test Runner",
            GIT_AUTHOR_EMAIL: "test@example.com",
            GIT_COMMITTER_NAME: "Test Runner",
            GIT_COMMITTER_EMAIL: "test@example.com",
          },
          reject: false,
        },
      );

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Git repository initialized");

      const projectDir = path.join(cwd, "git-app");
      expect(existsSync(path.join(projectDir, ".git"))).toBe(true);

      const branch = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
        cwd: projectDir,
        reject: false,
      });
      expect(branch.stdout.trim()).toBe("main");

      const log = await execa("git", ["log", "--oneline"], { cwd: projectDir, reject: false });
      expect(log.stdout.trim().length).toBeGreaterThan(0);
    },
  );
});
