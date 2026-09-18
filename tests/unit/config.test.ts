import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  globalConfigSchema,
  loadGlobalConfig,
  mergeWithGlobalConfig,
  saveGlobalConfig,
} from "../../src/config/global-config.js";
import { assertValidConfig } from "../../src/config/project-config.js";

describe("globalConfigSchema", () => {
  it("accepts an empty object", () => {
    expect(globalConfigSchema.safeParse({}).success).toBe(true);
  });

  it("accepts known keys and rejects unknown ones", () => {
    expect(globalConfigSchema.safeParse({ packageManager: "pnpm" }).success).toBe(true);
    expect(globalConfigSchema.safeParse({ secret: "value" }).success).toBe(false);
  });

  it("rejects invalid enum values", () => {
    expect(globalConfigSchema.safeParse({ packageManager: "npm10" }).success).toBe(false);
    expect(globalConfigSchema.safeParse({ framework: "ember" }).success).toBe(false);
  });
});

describe("saveGlobalConfig / loadGlobalConfig", () => {
  it("round-trips values through a temp directory", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fsc-config-"));
    const file = path.join(dir, "config.json");
    const saved = saveGlobalConfig({ packageManager: "pnpm", eslint: false }, file);
    expect(saved).toBe(file);
    expect(existsSync(file)).toBe(true);

    const loaded = loadGlobalConfig(file);
    expect(loaded.packageManager).toBe("pnpm");
    expect(loaded.eslint).toBe(false);
  });

  it("returns empty config for a missing file", () => {
    const loaded = loadGlobalConfig(path.join(tmpdir(), "fsc-does-not-exist", "config.json"));
    expect(loaded).toEqual({});
  });

  it("returns empty config and does not throw for invalid JSON", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fsc-config-"));
    const file = path.join(dir, "config.json");
    writeFileSync(file, "{ not json", "utf8");
    expect(loadGlobalConfig(file)).toEqual({});
  });

  it("writes pretty JSON with a trailing newline", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fsc-config-"));
    const file = path.join(dir, "config.json");
    saveGlobalConfig({ git: true }, file);
    const text = readFileSync(file, "utf8");
    expect(text.endsWith("\n")).toBe(true);
    expect(text).toContain('"git": true');
  });
});

describe("mergeWithGlobalConfig", () => {
  it("prefers flags over global config", () => {
    const merged = mergeWithGlobalConfig({ framework: "next" }, { framework: "react" });
    expect(merged.framework).toBe("next");
  });

  it("falls back to global config when flags are absent", () => {
    const merged = mergeWithGlobalConfig({}, { styling: "tailwind", git: false });
    expect(merged.styling).toBe("tailwind");
    expect(merged.git).toBe(false);
  });

  it("keeps explicit false from flags (no-install, no-git)", () => {
    const merged = mergeWithGlobalConfig(
      { install: false, git: false },
      { install: true, git: true },
    );
    expect(merged.install).toBe(false);
    expect(merged.git).toBe(false);
  });

  it("drops undefined entries so prompts can detect gaps", () => {
    const merged = mergeWithGlobalConfig({}, {});
    expect(Object.keys(merged)).toHaveLength(0);
  });
});

describe("assertValidConfig", () => {
  it("accepts a complete valid config", () => {
    const config = assertValidConfig({
      projectName: "app",
      framework: "react",
      language: "typescript",
      styling: "plain",
      packageManager: "npm",
      eslint: true,
      prettier: false,
      git: true,
      install: false,
      force: false,
    });
    expect(config.projectName).toBe("app");
  });

  it("throws a readable error listing the offending fields", () => {
    expect(() => assertValidConfig({ projectName: "app" })).toThrow(/framework/);
  });

  it("rejects unknown frameworks and package managers", () => {
    const base = {
      projectName: "app",
      framework: "react",
      language: "typescript",
      styling: "plain",
      packageManager: "npm",
      eslint: true,
      prettier: true,
      git: true,
      install: true,
      force: false,
    };
    expect(() => assertValidConfig({ ...base, framework: "ember" })).toThrow();
    expect(() => assertValidConfig({ ...base, packageManager: "cargo" })).toThrow();
  });
});
