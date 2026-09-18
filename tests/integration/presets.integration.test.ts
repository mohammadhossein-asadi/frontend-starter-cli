import { afterAll, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";

/**
 * End-to-end preset tests: `--preset` generates full projects non-
 * interactively, flags override preset fields, global-config presets apply,
 * and unknown ids fail with a readable hint.
 */

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CLI = path.join(projectRoot, "bin", "frontend-starter.js");

const dirs: string[] = [];

// Local shim: per-test config dir with the given global config file.
function tempWorkdir(config?: object): { cwd: string; env: Record<string, string> } {
  const cwd = mkdtempSync(path.join(tmpdir(), "fsc-preset-"));
  dirs.push(cwd);
  const env: Record<string, string> = { ...process.env } as Record<string, string>;
  if (config !== undefined) {
    const cfgDir = path.join(cwd, "cfg");
    mkdirSync(cfgDir, { recursive: true });
    writeFileSync(path.join(cfgDir, "config.json"), JSON.stringify(config), "utf8");
    env.FRONTEND_STARTER_CONFIG_DIR = cfgDir;
  }
  return { cwd, env };
}

afterAll(() => {
  for (const dir of dirs) {
    rmSync(dir, { recursive: true, force: true });
  }
});

async function runCli(args: string[], cwd: string, env: Record<string, string>) {
  return execa("node", [CLI, ...args], { cwd, env, reject: false });
}

const BASE = ["--package-manager", "npm", "--no-git", "--yes"];

describe("create --preset (end-to-end)", () => {
  it("generates a complete blog preset (next+ts+tailwind+tooling) from one flag", async () => {
    const { cwd, env } = tempWorkdir();
    const result = await runCli(
      ["create", "my-blog", "--preset", "blog", "--no-install", ...BASE],
      cwd,
      env,
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Starting point: Blog");
    const files = readdirSync(path.join(cwd, "my-blog"));
    expect(files).toContain("package.json");
    expect(files).toContain("eslint.config.mjs");
    const pkg = JSON.parse(readFileSync(path.join(cwd, "my-blog", "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies["next"]).toBeTruthy();
  }, 60_000);

  it("lets an explicit flag override the preset's framework", async () => {
    const { cwd, env } = tempWorkdir();
    // dashboard preset is react; --framework vue overrides it.
    const result = await runCli(
      [
        "create",
        "vue-board",
        "--preset",
        "dashboard",
        "--framework",
        "vue",
        "--no-install",
        ...BASE,
      ],
      cwd,
      env,
    );

    expect(result.exitCode).toBe(0);
    const pkg = JSON.parse(readFileSync(path.join(cwd, "vue-board", "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.dependencies["vue"]).toBeTruthy();
    expect(pkg.dependencies["react"]).toBeUndefined();
    // Preset styling (tailwind) still applied.
    expect(pkg.devDependencies["tailwindcss"]).toBeTruthy();
  }, 60_000);

  it("applies a preset from global config when no flag is given", async () => {
    const { cwd, env } = tempWorkdir({ preset: "landing-page" });
    const result = await runCli(["create", "lp-app", "--no-install", ...BASE], cwd, env);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Starting point: Landing page");
    // landing-page: eslint+prettier off.
    expect(existsSync(path.join(cwd, "lp-app", "eslint.config.mjs"))).toBe(false);
    expect(existsSync(path.join(cwd, "lp-app", ".prettierrc.json"))).toBe(false);
  }, 60_000);

  it("rejects unknown presets with a readable hint", async () => {
    const { cwd, env } = tempWorkdir();
    const result = await runCli(
      ["create", "x", "--preset", "space-station", "--no-install", ...BASE],
      cwd,
      env,
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Unknown preset "space-station"');
    // The remediation hint (with the supported list) prints on stdout.
    expect(result.stdout).toContain("blog, dashboard, landing-page");
  }, 60_000);

  it("generates a full project from --preset + --yes alone (auto-detected PM)", async () => {
    const { cwd, env } = tempWorkdir();
    // Presets never pick a package manager (machine-specific); in
    // non-interactive mode the CLI auto-detects one, so a single --preset
    // flag is enough for a complete run. --no-install keeps it offline-fast
    // (flags beat the preset's install: true).
    const result = await runCli(
      ["create", "one-flag", "--preset", "blog", "--yes", "--no-install", "--no-git"],
      cwd,
      env,
    );

    expect(result.exitCode).toBe(0);
    const files = readdirSync(path.join(cwd, "one-flag"));
    expect(files).toContain("package.json");
    expect(files).toContain("eslint.config.mjs");
    // Next.js layout proves the framework came from the preset.
    expect(existsSync(path.join(cwd, "one-flag", "app", "layout.tsx"))).toBe(true);
  }, 60_000);
});
