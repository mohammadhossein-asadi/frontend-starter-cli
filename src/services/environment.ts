import os from "node:os";
import { run } from "../utils/exec.js";
import { EnvironmentError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import type { DoctorCheck } from "../types.js";

/** Minimum Node version required by this CLI (mirrors package.json engines). */
const MIN_NODE_MAJOR = 20;
const MIN_NODE_MINOR = 19;

/** Assert the running Node.js satisfies the CLI's floor, or throw readably. */
export function assertSupportedNode(): void {
  const raw = process.versions.node;
  const [major, minor] = raw.split(".").map((part) => Number.parseInt(part, 10));
  const tooOld =
    major === undefined ||
    minor === undefined ||
    major < MIN_NODE_MAJOR ||
    (major === MIN_NODE_MAJOR && minor < MIN_NODE_MINOR);
  if (tooOld) {
    throw new EnvironmentError(
      `Node.js v${raw} is not supported. This CLI requires Node.js >= ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}.`,
      {
        hint: "Upgrade Node.js at https://nodejs.org (or via your version manager) and try again.",
      },
    );
  }
}

async function commandVersion(file: string, args: readonly string[]): Promise<string | null> {
  try {
    const result = await run(file, args);
    if (result.failed) return null;
    const line = (result.stdout || result.stderr).trim().split("\n")[0] ?? "";
    return line || null;
  } catch {
    return null;
  }
}

/** Collect every doctor check for the current machine. */
export async function collectDoctorChecks(): Promise<DoctorCheck[]> {
  const nodeVersion = await commandVersion("node", ["--version"]);
  const npmVersion = await commandVersion("npm", ["--version"]);
  const pnpmVersion = await commandVersion("pnpm", ["--version"]);
  const yarnVersion = await commandVersion("yarn", ["--version"]);
  const bunVersion = await commandVersion("bun", ["--version"]);
  const gitVersion = await commandVersion("git", ["--version"]);

  const nodeOk = nodeVersion !== null && nodeSatisfiesFloor(nodeVersion);
  const anyPackageManager =
    pnpmVersion !== null || npmVersion !== null || yarnVersion !== null || bunVersion !== null;

  const checks: DoctorCheck[] = [
    {
      name: "Operating System",
      ok: true,
      detail: osLabel(),
    },
    {
      name: "Architecture",
      ok: true,
      detail: os.arch(),
    },
    {
      name: "Node.js",
      ok: nodeOk,
      detail: nodeVersion ?? "not found",
      hint:
        nodeVersion === null
          ? "Install Node.js >= 20.19 from https://nodejs.org."
          : `This CLI requires Node.js >= ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}. Detected: ${nodeVersion}.`,
    },
    {
      name: "npm",
      ok: npmVersion !== null,
      detail: npmVersion ?? "not found",
      hint:
        npmVersion === null
          ? "npm ships with Node.js — reinstall Node.js from https://nodejs.org."
          : undefined,
    },
    {
      name: "pnpm",
      ok: pnpmVersion !== null,
      detail: pnpmVersion ?? "not installed",
      hint: pnpmVersion === null ? "Optional. Install with: npm install -g pnpm" : undefined,
      optional: true,
    },
    {
      name: "yarn",
      ok: yarnVersion !== null,
      detail: yarnVersion ?? "not installed",
      hint: yarnVersion === null ? "Optional. Install with: npm install -g yarn" : undefined,
      optional: true,
    },
    {
      name: "bun",
      ok: bunVersion !== null,
      detail: bunVersion ?? "not installed",
      hint: bunVersion === null ? "Optional. Install from https://bun.sh." : undefined,
      optional: true,
    },
    {
      name: "Package manager",
      ok: anyPackageManager,
      detail: anyPackageManager ? "at least one available" : "none found",
      hint: anyPackageManager ? undefined : "Install Node.js from https://nodejs.org to get npm.",
    },
    {
      name: "Git",
      ok: gitVersion !== null,
      detail: gitVersion ?? "not found",
      hint:
        gitVersion === null
          ? "Optional (skips `git init`). Install from https://git-scm.com."
          : undefined,
      optional: true,
    },
  ];
  return checks;
}

/** Render doctor results; returns true when all required checks pass. */
export function reportDoctor(checks: readonly DoctorCheck[]): boolean {
  logger.print("Frontend Starter Doctor\n");
  let allOk = true;
  for (const check of checks) {
    if (check.ok) {
      logger.print(`  ✔ ${check.name}: ${check.detail}`);
    } else if (check.optional) {
      logger.print(`  ⚠ ${check.name}: ${check.detail} (optional)`);
      if (check.hint) logger.print(`      ${check.hint}`);
    } else {
      allOk = false;
      logger.print(`  ✖ ${check.name}: ${check.detail}`);
      if (check.hint) logger.print(`      ${check.hint}`);
    }
  }
  logger.print(
    allOk ? "\nEnvironment looks good." : "\nFix the issues above for the best experience.",
  );
  return allOk;
}

function nodeSatisfiesFloor(version: string): boolean {
  const cleaned = version.startsWith("v") ? version.slice(1) : version;
  const [major, minor] = cleaned.split(".").map((part) => Number.parseInt(part, 10));
  if (major === undefined || minor === undefined || Number.isNaN(major) || Number.isNaN(minor))
    return false;
  if (major > MIN_NODE_MAJOR) return true;
  if (major < MIN_NODE_MAJOR) return false;
  return minor >= MIN_NODE_MINOR;
}

function osLabel(): string {
  switch (process.platform) {
    case "win32":
      return `Windows (${os.release()})`;
    case "darwin":
      return `macOS (${os.release()})`;
    case "linux":
      return `Linux (${os.release()})`;
    default:
      return `${process.platform} (${os.release()})`;
  }
}
