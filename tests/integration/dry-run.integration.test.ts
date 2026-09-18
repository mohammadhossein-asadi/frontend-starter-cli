import { afterAll, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";

/**
 * End-to-end tests for `create --dry-run`: the CLI must render a preview and
 * exit 0 without writing anything to disk, and must downgrade the
 * existing-directory conflict to a warning in preview mode.
 */

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CLI = path.join(projectRoot, "bin", "frontend-starter.js");
const env = {
  ...process.env,
  FRONTEND_STARTER_CONFIG_DIR: path.join(tmpdir(), `fsc-dryrun-${process.pid}`),
};

const dirs: string[] = [];
function tempWorkdir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "fsc-dryrun-"));
  dirs.push(dir);
  return dir;
}

afterAll(() => {
  for (const dir of dirs) {
    rmSync(dir, { recursive: true, force: true });
  }
});

async function runCli(args: string[], cwd: string) {
  return execa("node", [CLI, ...args], { cwd, env, reject: false });
}

const COMMON_FLAGS = [
  "--framework",
  "react",
  "--typescript",
  "--tailwind",
  "--package-manager",
  "npm",
  "--no-git",
  "--no-install",
  "--yes",
];

describe("create --dry-run (end-to-end)", () => {
  it("previews the file tree and package.json without writing anything", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(["create", "preview-app", ...COMMON_FLAGS, "--dry-run"], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Dry run");
    expect(result.stdout).toContain("preview-app");
    expect(result.stdout).toContain("package.json would contain:");

    // Nothing may be created on disk.
    expect(existsSync(path.join(cwd, "preview-app"))).toBe(false);
  });

  it("lists framework-specific files in the preview", async () => {
    const cwd = tempWorkdir();
    const react = await runCli(["create", "p-react", ...COMMON_FLAGS, "--dry-run"], cwd);
    expect(react.exitCode).toBe(0);
    expect(react.stdout).toContain("main.tsx");
    expect(react.stdout).toContain("vite.config.ts");

    const next = await runCli(
      [
        "create",
        "p-next",
        "--framework",
        "next",
        "--typescript",
        "--tailwind",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
        "--dry-run",
      ],
      cwd,
    );
    expect(next.exitCode).toBe(0);
    expect(next.stdout).toContain("layout.tsx");

    const vue = await runCli(
      [
        "create",
        "p-vue",
        "--framework",
        "vue",
        "--typescript",
        "--tailwind",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
        "--dry-run",
      ],
      cwd,
    );
    expect(vue.exitCode).toBe(0);
    expect(vue.stdout).toContain("App.vue");
    expect(vue.stdout).toContain("vite.config.ts");
  });

  it("warns (but does not fail) when the target exists and is non-empty", async () => {
    const cwd = tempWorkdir();
    const target = path.join(cwd, "occupied");
    mkdirSync(target, { recursive: true });
    writeFileSync(path.join(target, "keep-me.txt"), "existing content", "utf8");

    const result = await runCli(["create", "occupied", ...COMMON_FLAGS, "--dry-run"], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain("already exists and is not empty");
    // The pre-existing file is untouched and nothing new was written.
    expect(readFileSync(path.join(target, "keep-me.txt"), "utf8")).toBe("existing content");
    expect(existsSync(path.join(target, "package.json"))).toBe(false);
  });
});
