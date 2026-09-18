import { FRAMEWORKS, type Framework } from "../../types.js";

/**
 * Human-readable labels for every framework. Shared by the create prompts,
 * `init` and `templates` so a new framework only needs a label here (plus a
 * record-completeness compile error if it is forgotten).
 */
export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React (Vite)",
  next: "Next.js (App Router)",
  vue: "Vue (Vite)",
};

/** Convenience helper: labels for a subset of frameworks, in given order. */
export function frameworkLabels(
  frameworks: readonly Framework[] = FRAMEWORKS,
): { value: Framework; label: string }[] {
  return frameworks.map((framework) => ({ value: framework, label: FRAMEWORK_LABELS[framework] }));
}
