import path from "node:path";
import { ValidationError } from "./errors.js";

/**
 * npm package-name rules, scoped name support, and Windows reserved device
 * names (CON, PRN, AUX, NUL, COM1-9, LPT1-9). A project directory is also a
 * package name, so both constraint sets must pass.
 */

const MAX_LENGTH = 214; // npm limit
const NAME_RE = /^[a-z0-9][a-z0-9._-]*$/i;
const SCOPED_RE = /^@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/i;
const WINDOWS_RESERVED = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
]);

export interface NameCheck {
  ok: boolean;
  /** Normalized name that is safe to use, if ok. */
  name?: string;
  error?: string;
}

/** Validate and normalize a project name (does not check the filesystem). */
export function validateProjectName(rawName: string): NameCheck {
  const name = rawName.trim();
  if (!name) return { ok: false, error: "Project name cannot be empty." };
  if (name.length > MAX_LENGTH) {
    return { ok: false, error: `Project name exceeds ${MAX_LENGTH} characters (npm limit).` };
  }

  // Split scoped names: "@scope/pkg" — both parts validated separately.
  const parts = name.startsWith("@") ? splitScoped(name) : [name];
  if (parts.length === 0) {
    return { ok: false, error: `Invalid scoped name "${name}". Use @scope/package.` };
  }

  for (const part of parts) {
    const base = path.basename(part);
    if (base !== part) {
      return { ok: false, error: `Name must not contain path separators (got "${part}").` };
    }
    if (base === "." || base === "..") {
      return { ok: false, error: `Name segment "${base}" is not allowed.` };
    }
    if (WINDOWS_RESERVED.has(base.toUpperCase())) {
      return {
        ok: false,
        error: `"${base}" is a reserved Windows device name and cannot be used as a directory.`,
      };
    }
    if (!NAME_RE.test(base)) {
      return {
        ok: false,
        error:
          `Name "${base}" must start with a letter or digit and contain only ` +
          `letters, digits, ".", "-" and "_" (no spaces or special characters).`,
      };
    }
    if (base.startsWith(".")) {
      return { ok: false, error: `Name segment cannot start with ".".` };
    }
  }

  return { ok: true, name: name.toLowerCase() };
}

/** Split "@scope/pkg" into parts, or return [] when malformed. */
function splitScoped(name: string): string[] {
  const match = /^@([^/]+)\/([^/]+)$/.exec(name);
  if (!match || !SCOPED_RE.test(name)) return [];
  return [match[1] ?? "", match[2] ?? ""];
}

/** Validate a name, throwing a ValidationError on failure. */
export function assertValidProjectName(rawName: string): string {
  const check = validateProjectName(rawName);
  if (!check.ok || !check.name) {
    throw new ValidationError(check.error ?? "Invalid project name.");
  }
  return check.name;
}
