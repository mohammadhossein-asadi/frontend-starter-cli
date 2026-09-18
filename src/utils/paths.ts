import { homedir } from "node:os";
import path from "node:path";

/** Resolve the absolute target directory for a project name, without creating it. */
export function resolveTargetDir(projectName: string, cwd: string = process.cwd()): string {
  return path.resolve(cwd, projectName);
}

/**
 * Cross-platform config directory following platform conventions, with a
 * legacy-friendly fallback: %APPDATA% (Windows), XDG_CONFIG_HOME or
 * ~/.config (Linux), ~/Library/Preferences (macOS).
 */
export function configDir(): string {
  const home = homedir();
  const override = process.env["FRONTEND_STARTER_CONFIG_DIR"];
  if (override) return path.resolve(override);

  switch (process.platform) {
    case "win32": {
      const appData = process.env["APPDATA"];
      return appData
        ? path.join(appData, "frontend-starter")
        : path.join(home, ".frontend-starter");
    }
    case "darwin":
      return path.join(home, "Library", "Preferences", "frontend-starter");
    default: {
      const xdg = process.env["XDG_CONFIG_HOME"];
      return xdg
        ? path.join(xdg, "frontend-starter")
        : path.join(home, ".config", "frontend-starter");
    }
  }
}

/** Full path of the global config file. */
export function configFilePath(): string {
  return path.join(configDir(), "config.json");
}

/**
 * Convert any path to POSIX separators for use in template file maps.
 * Templates always use forward slashes internally.
 */
export function toPosix(p: string): string {
  return p.split(path.sep).join("/");
}

/** True if `child` is inside (or equal to) `parent`. Both may be any style. */
export function isInside(parent: string, child: string): boolean {
  const rel = path.relative(path.resolve(parent), path.resolve(child));
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}
