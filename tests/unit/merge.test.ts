import { describe, expect, it } from "vitest";
import { deepMerge, isPlainObject, mergeAll, serializeJson } from "../../src/templates/merge.js";
import type { Json } from "../../src/templates/merge.js";

describe("deepMerge", () => {
  it("merges nested objects key by key", () => {
    const base = { a: { x: 1, y: 2 }, b: "keep" } as unknown as Json;
    const patch = { a: { y: 3, z: 4 } } as unknown as Json;
    expect(deepMerge(base, patch)).toEqual({ a: { x: 1, y: 3, z: 4 }, b: "keep" });
  });

  it("lets later scalars win", () => {
    const base = { name: "old", version: "1.0.0" } as unknown as Json;
    const patch = { name: "new" } as unknown as Json;
    expect(deepMerge(base, patch)).toEqual({ name: "new", version: "1.0.0" });
  });

  it("replaces arrays wholesale", () => {
    const base = { list: [1, 2] } as unknown as Json;
    const patch = { list: [3] } as unknown as Json;
    expect(deepMerge(base, patch)).toEqual({ list: [3] });
  });

  it("replaces a scalar with an object and vice versa", () => {
    const base = { a: 1 } as unknown as Json;
    const patch = { a: { b: 2 } } as unknown as Json;
    expect(deepMerge(base, patch)).toEqual({ a: { b: 2 } });
    expect(deepMerge({ a: { b: 2 } }, { a: 1 })).toEqual({ a: 1 });
  });

  it("does not mutate its inputs", () => {
    const base = { a: { x: 1 } };
    const patch = { a: { y: 2 } };
    deepMerge(base, patch);
    expect(base).toEqual({ a: { x: 1 } });
    expect(patch).toEqual({ a: { y: 2 } });
  });
});

describe("mergeAll", () => {
  it("folds documents left to right", () => {
    const docs = [
      { scripts: { dev: "vite" }, deps: { react: "1" } },
      { scripts: { lint: "eslint ." } },
      { deps: { react: "2" } },
    ] as unknown as Json[];
    expect(mergeAll(docs)).toEqual({
      scripts: { dev: "vite", lint: "eslint ." },
      deps: { react: "2" },
    });
  });

  it("throws on an empty list", () => {
    expect(() => mergeAll([])).toThrow();
  });
});

describe("isPlainObject / serializeJson", () => {
  it("distinguishes objects from arrays", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
  });

  it("serializes with two-space indent and trailing newline", () => {
    expect(serializeJson({ a: 1 })).toBe('{\n  "a": 1\n}\n');
  });
});
