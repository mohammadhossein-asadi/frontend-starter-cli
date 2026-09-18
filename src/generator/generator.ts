import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ResolvedTemplate } from "../types.js";
import { TargetDirectoryError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { isInside } from "../utils/paths.js";

/**
 * Writes a resolved template to disk. Security invariants:
 *  - every file path must be relative, POSIX-style, and traverse-free;
 *  - every resolved absolute path must stay inside the target directory;
 *  - the generator never deletes files (overwrite is explicit caller logic).
 */

const FORBIDDEN_SEGMENTS = new Set([".."]);

function assertSafeRelativePath(relativePath: string): void {
  if (path.isAbsolute(relativePath)) {
    throw new TargetDirectoryError(`Template produced an absolute path: "${relativePath}"`);
  }
  const segments = relativePath.split(/[\\/]/);
  for (const segment of segments) {
    if (FORBIDDEN_SEGMENTS.has(segment)) {
      throw new TargetDirectoryError(`Template produced an unsafe path: "${relativePath}"`);
    }
  }
}

/** Write all files from a resolved template into targetDir. Returns count. */
export function generateFiles(resolved: ResolvedTemplate, targetDir: string): number {
  let written = 0;
  for (const [relativePath, contents] of Object.entries(resolved.files)) {
    assertSafeRelativePath(relativePath);
    const absolutePath = path.resolve(targetDir, relativePath);
    if (!isInside(targetDir, absolutePath)) {
      throw new TargetDirectoryError(`Refusing to write outside the project: "${relativePath}"`);
    }
    mkdirSync(path.dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, contents, { encoding: "utf8" });
    logger.detail(`wrote ${relativePath}`);
    written += 1;
  }
  return written;
}
