import { describe, expect, it } from "vitest";
import { assertValidProjectName, validateProjectName } from "../../src/utils/name-validation.js";
import { ValidationError } from "../../src/utils/errors.js";

describe("validateProjectName", () => {
  it("accepts simple names and normalizes casing", () => {
    const result = validateProjectName("My-App_1");
    expect(result.ok).toBe(true);
    expect(result.name).toBe("my-app_1");
  });

  it("accepts dots and digits after the first character", () => {
    expect(validateProjectName("app.v2-x").ok).toBe(true);
  });

  it("accepts scoped names", () => {
    const result = validateProjectName("@scope/pkg");
    expect(result.ok).toBe(true);
    expect(result.name).toBe("@scope/pkg");
  });

  it("rejects empty names", () => {
    expect(validateProjectName("   ").ok).toBe(false);
  });

  it("rejects names with spaces or special characters", () => {
    expect(validateProjectName("my app").ok).toBe(false);
    expect(validateProjectName("my/app").ok).toBe(false);
    expect(validateProjectName("my*app").ok).toBe(false);
  });

  it("rejects path separators and traversal", () => {
    expect(validateProjectName("../escape").ok).toBe(false);
    expect(validateProjectName("a/b").ok).toBe(false);
  });

  it("rejects dot-leading and dot-only segments", () => {
    expect(validateProjectName(".hidden").ok).toBe(false);
    expect(validateProjectName(".").ok).toBe(false);
    expect(validateProjectName("..").ok).toBe(false);
  });

  it("rejects Windows reserved device names in any case", () => {
    for (const name of ["con", "NUL", "Com1", "lpt9", "aux"]) {
      const result = validateProjectName(name);
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/reserved Windows device name/i);
    }
  });

  it("rejects malformed scoped names", () => {
    expect(validateProjectName("@scope").ok).toBe(false);
    expect(validateProjectName("@scope/").ok).toBe(false);
    expect(validateProjectName("@/pkg").ok).toBe(false);
  });

  it("rejects names beyond the npm length limit", () => {
    expect(validateProjectName("a".repeat(215)).ok).toBe(false);
    expect(validateProjectName("a".repeat(214)).ok).toBe(true);
  });
});

describe("assertValidProjectName", () => {
  it("returns the normalized name", () => {
    expect(assertValidProjectName("Demo")).toBe("demo");
  });

  it("throws a ValidationError with a readable message", () => {
    expect(() => assertValidProjectName("bad name")).toThrow(ValidationError);
    expect(() => assertValidProjectName("bad name")).toThrow(/letters, digits/);
  });
});
