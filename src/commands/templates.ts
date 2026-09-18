import { FRAMEWORKS, STYLINGS } from "../types.js";
import { FRAMEWORK_LABELS } from "../templates/shared/labels.js";
import { logger } from "../utils/logger.js";

/** `frontend-starter templates` (alias: list) — enumerate supported combos. */
export function runTemplates(): number {
  logger.print("Supported templates:\n");
  for (const framework of FRAMEWORKS) {
    logger.print(`  ${FRAMEWORK_LABELS[framework]}`);
    logger.print("    languages:    TypeScript, JavaScript");
    const styling = STYLINGS.map((s) =>
      s === "tailwind" ? "Tailwind CSS v4" : s === "css-modules" ? "CSS Modules" : "Plain CSS",
    ).join(", ");
    logger.print(`    styling:      ${styling}`);
    logger.print("    extras:       ESLint, Prettier, Git, dependency installation");
    logger.print("");
  }
  logger.print("Package managers: pnpm, npm, yarn, bun (auto-detected; configurable order).");
  logger.print("New frameworks slot in via the template registry — see CONTRIBUTING.md.");
  return 0;
}
