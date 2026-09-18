/**
 * JSON-aware deep merge used to compose package.json (and other JSON files)
 * from framework base + overlays. Order matters: later parts win on scalar
 * conflicts; objects (dependencies, scripts, engines…) merge key-by-key.
 */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export function isPlainObject(value: unknown): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep-merge `patch` into `base` and return a new object. Arrays and scalars
 * are replaced (later wins); plain objects are merged recursively.
 */
export function deepMerge<T extends Json>(base: T, patch: Json): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return structuredClone(patch) as T;
  }
  const result: Record<string, Json> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    const existing = result[key];
    result[key] =
      isPlainObject(existing) && isPlainObject(value) ? deepMerge(existing, value) : value;
  }
  return result as T;
}

/**
 * Merge a sequence of JSON documents left-to-right. Non-object values are not
 * expected at the top level and are simply replaced by later documents.
 */
export function mergeAll<T extends Json>(documents: readonly T[]): T {
  if (documents.length === 0) throw new Error("mergeAll requires at least one document");
  let acc: T = structuredClone(documents[0] as T);
  for (const doc of documents.slice(1)) {
    acc = deepMerge(acc, doc);
  }
  return acc;
}

/** Stable, pretty-printed JSON text used when writing JSON files. */
export function serializeJson(value: Json): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
