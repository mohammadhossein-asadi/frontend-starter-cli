import type { ProjectConfig, ResolvedTemplate, TemplatePart } from "../types.js";
import type { Json } from "./merge.js";
import { mergeAll, serializeJson } from "./merge.js";
import { ValidationError } from "../utils/errors.js";
import { fullGitignore } from "./shared/gitignore.js";
import { renderReadme } from "./shared/readme.js";
import {
  reactBasePackage,
  nextBasePackage,
  vueBasePackage,
  svelteBasePackage,
  solidBasePackage,
  qwikBasePackage,
  astroBasePackage,
  angularBasePackage,
  tailwindPackage,
  eslintPackage,
  prettierPackageFor,
  cssModulesPackage,
} from "./react/package.js";
import { reactTsPart } from "./react/ts-part.js";
import { reactJsPart } from "./react/js-part.js";
import { nextTsPart } from "./next/ts-part.js";
import { nextJsPart } from "./next/js-part.js";
import { vueTsPart } from "./vue/ts-part.js";
import { vueJsPart } from "./vue/js-part.js";
import { svelteTsPart } from "./svelte/ts-part.js";
import { svelteJsPart } from "./svelte/js-part.js";
import { solidTsPart } from "./solid/ts-part.js";
import { solidJsPart } from "./solid/js-part.js";
import { qwikTsPart } from "./qwik/ts-part.js";
import { qwikJsPart } from "./qwik/js-part.js";
import { astroTsPart } from "./astro/ts-part.js";
import { astroJsPart } from "./astro/js-part.js";
import { angularTsPart } from "./angular/ts-part.js";
import {
  stylesheetFor,
  stylesheetPath,
  cssModulesFiles,
  eslintConfigFor,
  prettierFiles,
  tailwindConfigFiles,
} from "./overlays/overlays.js";

/**
 * The template registry. Resolves a ProjectConfig into an ordered list of
 * template parts (framework base → styling overlay → tooling overlays →
 * shared files). Adding a framework means adding template modules plus a case
 * here — no CLI changes.
 */
export function resolveTemplate(config: ProjectConfig): ResolvedTemplate {
  const parts: TemplatePart[] = [];

  // 1. Framework base files (language slice).
  switch (config.framework) {
    case "react":
      parts.push(config.language === "typescript" ? reactTsPart() : reactJsPart());
      break;
    case "next":
      parts.push(config.language === "typescript" ? nextTsPart() : nextJsPart());
      break;
    case "vue":
      parts.push(config.language === "typescript" ? vueTsPart() : vueJsPart());
      break;
    case "svelte":
      parts.push(config.language === "typescript" ? svelteTsPart() : svelteJsPart());
      break;
    case "solid":
      parts.push(config.language === "typescript" ? solidTsPart() : solidJsPart());
      break;
    case "qwik":
      parts.push(config.language === "typescript" ? qwikTsPart() : qwikJsPart());
      break;
    case "astro":
      parts.push(config.language === "typescript" ? astroTsPart() : astroJsPart());
      break;
    case "angular":
      parts.push(angularTsPart());
      break;
    default: {
      exhaustiveness(config.framework);
    }
  }

  // 2. Styling overlay: the stylesheet, framework Tailwind wiring where the
  // plugin must be registered, plus App/page swap for CSS Modules.
  parts.push({
    id: `overlays/styling/${config.styling}`,
    files: {
      [stylesheetPath(config)]: stylesheetFor(config),
      ...(config.styling === "tailwind" ? tailwindConfigFiles(config) : {}),
      ...(config.styling === "css-modules" ? cssModulesFiles(config) : {}),
    },
  });

  // 3. ESLint overlay.
  if (config.eslint) {
    parts.push({
      id: "overlays/eslint",
      files: { "eslint.config.mjs": eslintConfigFor(config) },
    });
  }

  // 4. Prettier overlay.
  if (config.prettier) {
    parts.push({
      id: "overlays/prettier",
      files: prettierFiles(config),
    });
  }

  // 5. package.json composition via ordered fragments.
  const fragments: Json[] = [];
  switch (config.framework) {
    case "react":
      fragments.push(reactBasePackage(config.language, config.projectName));
      break;
    case "next":
      fragments.push(nextBasePackage(config.language, config.projectName));
      break;
    case "vue":
      fragments.push(vueBasePackage(config.language, config.projectName));
      break;
    case "svelte":
      fragments.push(svelteBasePackage(config.language, config.projectName));
      break;
    case "solid":
      fragments.push(solidBasePackage(config.language, config.projectName));
      break;
    case "qwik":
      fragments.push(qwikBasePackage(config.language, config.projectName));
      break;
    case "astro":
      fragments.push(astroBasePackage(config.language, config.projectName));
      break;
    case "angular":
      fragments.push(angularBasePackage(config.projectName));
      break;
    default:
      exhaustiveness(config.framework);
  }
  if (config.styling === "tailwind") fragments.push(tailwindPackage(config.framework));
  if (config.styling === "css-modules") fragments.push(cssModulesPackage());
  if (config.eslint) fragments.push(eslintPackage(config.framework));
  if (config.prettier) fragments.push(prettierPackageFor(config.framework, config.language));

  // 6. Shared files, always last so nothing overrides them.
  parts.push({
    id: "shared",
    files: {
      ".gitignore": fullGitignore(config.framework),
      "README.md": renderReadme(config),
      "package.json": serializeJson(mergeAll(fragments)),
    },
  });

  // Flatten file maps across parts; later parts override earlier ones.
  const files: Record<string, string> = {};
  const partIds: string[] = [];
  for (const part of parts) {
    partIds.push(part.id);
    for (const [filePath, contents] of Object.entries(part.files)) {
      files[filePath] = contents;
    }
  }

  return {
    framework: config.framework,
    language: config.language,
    styling: config.styling,
    parts: partIds,
    files,
  };
}

function exhaustiveness(value: never): never {
  throw new ValidationError(`Unknown framework: ${String(value)}`);
}
