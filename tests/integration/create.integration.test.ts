import { afterAll, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";

/**
 * End-to-end tests: run the built CLI (dist) exactly like a user would,
 * non-interactively, into temp directories. --no-install / --no-git keep the
 * runs fast, offline-safe and side-effect free.
 */

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CLI = path.join(projectRoot, "bin", "frontend-starter.js");
const env = {
  ...process.env,
  FRONTEND_STARTER_CONFIG_DIR: path.join(tmpdir(), `fsc-noconf-${process.pid}`),
};

const dirs: string[] = [];
function tempWorkdir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "fsc-e2e-"));
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

describe("create (end-to-end)", () => {
  it("generates a complete react+ts+tailwind project with npm flags", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(
      [
        "create",
        "app1",
        "--framework",
        "react",
        "--typescript",
        "--tailwind",
        "--eslint",
        "--prettier",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
      ],
      cwd,
    );
    expect(result.exitCode).toBe(0);

    const files = readdirSync(path.join(cwd, "app1"));
    for (const expected of [
      "package.json",
      "index.html",
      "src",
      "eslint.config.mjs",
      ".prettierrc.json",
      ".gitignore",
      "README.md",
    ]) {
      expect(files, `missing ${expected}`).toContain(expected);
    }
    const pkg = JSON.parse(readFileSync(path.join(cwd, "app1", "package.json"), "utf8")) as {
      name: string;
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.name).toBe("app1");
    expect(pkg.devDependencies["tailwindcss"]).toBeTruthy();
    expect(pkg.scripts["lint"]).toBeTruthy();

    expect(result.stdout).toContain("app1");
  }, 60_000);

  it("generates next+js with css modules and no eslint artifacts", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(
      [
        "create",
        "app2",
        "--framework",
        "next",
        "--javascript",
        "--styling",
        "css-modules",
        "--no-eslint",
        "--prettier",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
      ],
      cwd,
    );
    expect(result.exitCode).toBe(0);

    const appDir = path.join(cwd, "app2", "app");
    expect(existsSync(path.join(appDir, "page.jsx"))).toBe(true);
    expect(existsSync(path.join(appDir, "page.module.css"))).toBe(true);
    expect(existsSync(path.join(cwd, "app2", "eslint.config.mjs"))).toBe(false);
    const pkg = JSON.parse(readFileSync(path.join(cwd, "app2", "package.json"), "utf8")) as {
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.devDependencies["eslint"]).toBeUndefined();
    expect(pkg.scripts["lint"]).toBeUndefined();
  }, 60_000);

  it("respects --no-prettier and --no-eslint", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(
      [
        "create",
        "app3",
        "--framework",
        "react",
        "--typescript",
        "--styling",
        "plain",
        "--no-eslint",
        "--no-prettier",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
      ],
      cwd,
    );
    expect(result.exitCode).toBe(0);
    const files = readdirSync(path.join(cwd, "app3"));
    expect(files).not.toContain("eslint.config.mjs");
    expect(files).not.toContain(".prettierrc.json");
  }, 60_000);

  it("fails with a readable error for invalid project names", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(
      ["create", "con", "--framework", "react", "--typescript", "--yes"],
      cwd,
    );
    expect(result.exitCode).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toMatch(/reserved Windows device name/i);
  }, 60_000);

  it("fails for unknown frameworks and package managers", async () => {
    const cwd = tempWorkdir();
    const bad = await runCli(
      [
        "create",
        "app4",
        "--framework",
        "angular",
        "--typescript",
        "--styling",
        "plain",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
      ],
      cwd,
    );
    expect(bad.exitCode).toBe(1);
    expect(`${bad.stdout}${bad.stderr}`).toMatch(/angular/i);

    const badPm = await runCli(
      [
        "create",
        "app5",
        "--framework",
        "react",
        "--typescript",
        "--styling",
        "plain",
        "--package-manager",
        "cargo",
        "--no-git",
        "--no-install",
        "--yes",
      ],
      cwd,
    );
    expect(badPm.exitCode).toBe(1);
    expect(`${badPm.stdout}${badPm.stderr}`).toMatch(/not a supported package manager/i);
  }, 60_000);

  it("requires all options in non-interactive mode", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(["create", "app6", "--framework", "react", "--yes"], cwd);
    expect(result.exitCode).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toMatch(/non-interactive/i);
  }, 60_000);

  it("refuses to overwrite a non-empty directory without --force", async () => {
    const cwd = tempWorkdir();
    const blocked = path.join(cwd, "blocked");
    mkdirSync(blocked);
    writeFileSync(path.join(blocked, "keep.txt"), "keep me", "utf8");
    const result = await runCli(
      [
        "create",
        "blocked",
        "--framework",
        "react",
        "--typescript",
        "--styling",
        "plain",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
      ],
      cwd,
    );
    expect(result.exitCode).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toMatch(/already exists/i);
    expect(existsSync(path.join(blocked, "keep.txt"))).toBe(true);
  }, 60_000);

  it("refuses a target that exists as a plain file", async () => {
    const cwd = tempWorkdir();
    writeFileSync(path.join(cwd, "notadir"), "i am a file", "utf8");
    const result = await runCli(
      [
        "create",
        "notadir",
        "--framework",
        "react",
        "--typescript",
        "--styling",
        "plain",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
      ],
      cwd,
    );
    expect(result.exitCode).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toMatch(/not a directory/i);
  }, 60_000);

  it("overwrites files inside an existing directory with --force (adds template files)", async () => {
    const cwd = tempWorkdir();
    const victim = path.join(cwd, "victim");
    mkdirSync(victim);
    writeFileSync(path.join(victim, "user-file.txt"), "original", "utf8");
    const result = await runCli(
      [
        "create",
        "victim",
        "--framework",
        "react",
        "--typescript",
        "--styling",
        "plain",
        "--package-manager",
        "npm",
        "--no-git",
        "--no-install",
        "--yes",
        "--force",
      ],
      cwd,
    );
    expect(result.exitCode).toBe(0);
    // Existing files are kept; template files are added alongside them.
    expect(readFileSync(path.join(victim, "user-file.txt"), "utf8")).toBe("original");
    expect(readFileSync(path.join(victim, "package.json"), "utf8")).toContain("react");
  }, 60_000);

  it("init-free bare run defaults to create (help confirms)", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(["--help"], cwd);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("create");
    expect(result.stdout).toContain("doctor");
  }, 60_000);
});

describe("templates and doctor (end-to-end)", () => {
  it("templates lists all supported frameworks", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(["templates"], cwd);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("React");
    expect(result.stdout).toContain("Next.js");
  }, 60_000);

  it("doctor reports the environment and exits 0 on a healthy machine", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(["doctor"], cwd);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Node.js");
  }, 60_000);

  it("--version prints the package version", async () => {
    const cwd = tempWorkdir();
    const result = await runCli(["--version"], cwd);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
  }, 60_000);
});
