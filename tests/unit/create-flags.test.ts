import { describe, expect, it } from "vitest";
import { buildCli } from "../../src/index.js";
import {
  CREATE_FLAG_SPECS,
  declareCreateFlags,
  longFlagOf,
  parseCreateFlags,
  toKebab,
} from "../../src/commands/create-flags.js";
import type { CreateFlags } from "../../src/commands/create.js";
import { Command } from "commander";

/**
 * Regression net for the historic kebab/camelCase bug class, where
 * `--package-manager` and `--dry-run` were read back under their kebab keys
 * while commander stored them on camelCase keys, silently reading undefined.
 *
 * Strategy: buildCli() supplies the REAL declarations; we verify each spec
 * flag is registered there, and drive declareCreateFlags against a fresh
 * parser for round-trip value checks. Both sides derive from the same
 * CREATE_FLAG_SPECS table, so the tests pass only while the table, the
 * declarations and the parse mapping agree.
 */

/** Parse argv through a command with the real declarations, no action run. */
function parseCreate(argv: string[]): CreateFlags {
  const cmd = new Command();
  declareCreateFlags(cmd);
  cmd.argument("[name]");
  const parsed = cmd.parse(argv, { from: "user" });
  return parseCreateFlags(parsed.opts(), false);
}

describe("create-flags round trip", () => {
  it("registers every spec flag on the real buildCli() program", () => {
    const program = buildCli();
    const create = program.commands.find((cmd) => cmd.name() === "create");
    expect(create).toBeDefined();
    const registered = new Set(
      (create?.options.map((option) => option.long) ?? []).filter(
        (value): value is string => value !== undefined,
      ),
    );
    for (const spec of CREATE_FLAG_SPECS) {
      expect(registered.has(longFlagOf(spec.key)), longFlagOf(spec.key)).toBe(true);
      if (spec.negatedBy !== undefined) {
        expect(registered.has(spec.negatedBy), spec.negatedBy).toBe(true);
        expect(spec.negatedBy.startsWith("--no-")).toBe(true);
      }
      if (!spec.boolean) {
        const option = create?.options.find((o) => o.long === longFlagOf(spec.key));
        expect(option?.flags, `${longFlagOf(spec.key)} placeholder`).toContain("<");
      }
    }
    const negationCount = [...registered].filter((long) => long.startsWith("--no-")).length;
    expect(negationCount).toBe(4);
  });

  it("maps kebab-case flags onto their camelCase CreateFlags fields", () => {
    const flags = parseCreate([
      "my-app",
      "--framework",
      "vue",
      "--language",
      "typescript",
      "--styling",
      "plain",
      "--package-manager",
      "pnpm",
    ]);
    expect(flags.framework).toBe("vue");
    expect(flags.language).toBe("typescript");
    expect(flags.styling).toBe("plain");
    // The historic v0.1.0 bug: --package-manager read as opts["package-manager"].
    expect(flags.packageManager).toBe("pnpm");
  });

  it("maps the --dry-run flag (the v0.2.0 camelCase bug)", () => {
    expect(parseCreate(["app", "--dry-run"]).dryRun).toBe(true);
    expect(parseCreate(["app"]).dryRun).toBeUndefined();
  });

  it("keeps negatable booleans tri-state", () => {
    for (const spec of CREATE_FLAG_SPECS) {
      if (spec.negatedBy === undefined) continue;
      const positive = parseCreate(["app", longFlagOf(spec.key)]);
      expect(positive[spec.key], `--${spec.key} present`).toBe(true);
      const negative = parseCreate(["app", spec.negatedBy]);
      expect(negative[spec.key], `${spec.negatedBy} present`).toBe(false);
      const absent = parseCreate(["app"]);
      expect(absent[spec.key], `${spec.key} absent`).toBeUndefined();
    }
  });

  it("parses every declared value flag through its kebab form", () => {
    for (const spec of CREATE_FLAG_SPECS) {
      if (spec.boolean) continue;
      const flags = parseCreate(["app", longFlagOf(spec.key), "sample"]);
      expect(flags[spec.key], longFlagOf(spec.key)).toBe("sample");
    }
    expect(parseCreate(["app"]).framework).toBeUndefined();
  });
});

describe("create-flags helpers", () => {
  it("converts camelCase to kebab-case", () => {
    expect(toKebab("dryRun")).toBe("dry-run");
    expect(toKebab("packageManager")).toBe("package-manager");
    expect(toKebab("framework")).toBe("framework");
    expect(longFlagOf("dryRun")).toBe("--dry-run");
    expect(longFlagOf("packageManager")).toBe("--package-manager");
  });

  it("declareCreateFlags registers every spec on a plain command", () => {
    const cmd = new Command();
    declareCreateFlags(cmd);
    cmd.argument("[name]");
    const parsed = cmd.parse(["app", "--package-manager", "npm", "--dry-run"], { from: "user" });
    expect(parsed.opts().packageManager).toBe("npm");
    expect(parsed.opts().dryRun).toBe(true);
  });
});

describe("parseCreateFlags semantics", () => {
  it("booleans are true only when explicitly passed", () => {
    const flags = parseCreateFlags({ dryRun: true, force: false, framework: "react" }, false);
    expect(flags.dryRun).toBe(true);
    expect(flags.force).toBe(false);
    // Absent booleans stay undefined so global config/prompts still apply.
    expect(flags.tailwind).toBeUndefined();
  });

  it("propagates the global --yes as a fallback", () => {
    expect(parseCreateFlags({}, true).yes).toBe(true);
    expect(parseCreateFlags({ yes: true }, false).yes).toBe(true);
    expect(parseCreateFlags({}, false).yes).toBe(false);
  });
});
