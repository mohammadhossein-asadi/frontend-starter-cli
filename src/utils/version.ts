import { createRequire } from "node:module";
import path from "node:path";

/**
 * Read this CLI's own version. Works from source (tsup-less dev runs) and from
 * the published bundle by walking up from the compiled file to package.json.
 */
export function cliVersion(): string {
  try {
    // When bundled by tsup this becomes a static require of the package.json,
    // which works both from dist/ and when running via tsx from src/.
    const require = createRequire(import.meta.url);
    const pkg = require(path.join("..", "package.json")) as { version?: string };
    if (typeof pkg.version === "string" && pkg.version.length > 0) return pkg.version;
  } catch {
    // fall through
  }
  return "0.0.0-dev";
}
