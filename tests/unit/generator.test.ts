import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateFiles } from "../../src/generator/generator.js";
import type { ResolvedTemplate } from "../../src/types.js";
import { TargetDirectoryError } from "../../src/utils/errors.js";

function templateWith(files: Record<string, string>): ResolvedTemplate {
  return { framework: "react", language: "typescript", styling: "plain", parts: ["test"], files };
}

describe("generateFiles", () => {
  it("writes files with nested directories and returns the count", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fsc-gen-"));
    try {
      const count = generateFiles(
        templateWith({
          "package.json": "{}\n",
          "src/components/Button.tsx": "export const Button = () => null;\n",
        }),
        dir,
      );
      expect(count).toBe(2);
      expect(readFileSync(path.join(dir, "src", "components", "Button.tsx"), "utf8")).toContain(
        "Button",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects parent traversal attempts", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fsc-gen-"));
    try {
      expect(() => generateFiles(templateWith({ "../escaped.txt": "nope" }), dir)).toThrow(
        TargetDirectoryError,
      );
      expect(existsSync(path.join(dir, "..", "escaped.txt"))).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects absolute paths", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fsc-gen-"));
    // Absolute on every platform, unlike a hardcoded drive letter.
    const absoluteEvil = path.join(mkdtempSync(path.join(tmpdir(), "fsc-gen-")), "evil.txt");
    try {
      expect(() => generateFiles(templateWith({ [absoluteEvil]: "nope" }), dir)).toThrow(
        TargetDirectoryError,
      );
      // Rooted POSIX path is absolute on POSIX and Windows alike.
      expect(() => generateFiles(templateWith({ "/etc/evil.txt": "nope" }), dir)).toThrow(
        TargetDirectoryError,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("overwrites same-path files from later parts within one template", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fsc-gen-"));
    try {
      generateFiles(templateWith({ "README.md": "second" }), dir);
      expect(readFileSync(path.join(dir, "README.md"), "utf8")).toBe("second");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
