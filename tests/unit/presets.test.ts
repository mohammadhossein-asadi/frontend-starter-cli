import { describe, expect, it } from "vitest";
import {
  PRESETS,
  assertKnownPreset,
  expandPreset,
  isKnownPreset,
  resolvePreset,
} from "../../src/config/presets.js";
import { ValidationError } from "../../src/utils/errors.js";
import { FRAMEWORKS, LANGUAGES, STYLINGS } from "../../src/types.js";

describe("preset registry", () => {
  it("ships the three documented presets with unique ids", () => {
    expect(PRESETS.map((preset) => preset.id)).toEqual(["blog", "dashboard", "landing-page"]);
  });

  it("only references known framework, language and styling values", () => {
    for (const preset of PRESETS) {
      expect(FRAMEWORKS as readonly string[]).toContain(preset.values.framework);
      expect(LANGUAGES as readonly string[]).toContain(preset.values.language);
      expect(STYLINGS as readonly string[]).toContain(preset.values.styling);
      // Every preset fully specifies the extras so expansion is predictable.
      expect(typeof preset.values.eslint).toBe("boolean");
      expect(typeof preset.values.prettier).toBe("boolean");
      expect(typeof preset.values.git).toBe("boolean");
    }
  });

  it("accepts known ids and rejects unknown ones readably", () => {
    expect(isKnownPreset("blog")).toBe(true);
    expect(isKnownPreset("nope")).toBe(false);

    expect(assertKnownPreset("dashboard").label).toBe("Dashboard");
    try {
      assertKnownPreset("nope");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toContain('Unknown preset "nope"');
      expect((error as Error & { hint?: string }).hint ?? "").toContain(
        "blog, dashboard, landing-page",
      );
    }
  });
});

describe("expandPreset", () => {
  const blog = assertKnownPreset("blog");

  it("fills every value the preset declares", () => {
    const expanded = expandPreset(blog, {});
    expect(expanded.framework).toBe("next");
    expect(expanded.language).toBe("typescript");
    expect(expanded.styling).toBe("tailwind");
    expect(expanded.eslint).toBe(true);
    expect(expanded.prettier).toBe(true);
    expect(expanded.git).toBe(true);
    expect(expanded.install).toBe(true);
  });

  it("never overrides explicit flags (flags beat preset)", () => {
    const expanded = expandPreset(blog, { framework: "vue", eslint: false });
    expect(expanded.framework).toBe("vue");
    expect(expanded.eslint).toBe(false);
    // Untouched preset fields still land.
    expect(expanded.styling).toBe("tailwind");
  });

  it("returns the input unchanged when no preset is chosen", () => {
    const partial = { framework: "vue" as const };
    expect(expandPreset(undefined, partial)).toBe(partial);
  });
});

describe("resolvePreset", () => {
  it("prefers the flag over the global-config choice", () => {
    const preset = resolvePreset("landing-page", "blog");
    expect(preset?.id).toBe("landing-page");
  });

  it("falls back to the global choice, then to none", () => {
    expect(resolvePreset(undefined, "blog")?.id).toBe("blog");
    expect(resolvePreset(undefined, undefined)).toBeUndefined();
  });

  it("rejects unknown ids from either source", () => {
    expect(() => resolvePreset("nope", undefined)).toThrow(ValidationError);
    expect(() => resolvePreset(undefined, "nope")).toThrow(ValidationError);
  });
});
