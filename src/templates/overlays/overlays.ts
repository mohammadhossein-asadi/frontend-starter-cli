import type { Framework, ProjectConfig } from "../../types.js";
import { ValidationError } from "../../utils/errors.js";
import { viteConfig as svelteViteConfigTs } from "../svelte/ts-part.js";
import { viteConfig as svelteViteConfigJs } from "../svelte/js-part.js";
import { viteConfig as solidViteConfigTs } from "../solid/ts-part.js";
import { viteConfig as solidViteConfigJs } from "../solid/js-part.js";

/**
 * Overlay file contents: styling (Tailwind v4 / CSS Modules / plain CSS) and
 * tooling configs (ESLint flat, Prettier). package.json fragments for these
 * live in `../react/package.ts` (shared by every framework).
 */

const TAILWIND_CSS = [
  '@import "tailwindcss";',
  "",
  ":root {",
  "  color-scheme: light dark;",
  "}",
  "",
].join("\n");

const PLAIN_CSS_VITE = [
  ":root {",
  "  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;",
  "  color-scheme: light dark;",
  "}",
  "",
  "body {",
  "  margin: 0;",
  "  display: flex;",
  "  place-items: center;",
  "  min-width: 320px;",
  "  min-height: 100vh;",
  "}",
  "",
  ".app {",
  "  max-width: 1280px;",
  "  margin: 0 auto;",
  "  padding: 2rem;",
  "  text-align: center;",
  "}",
  "",
].join("\n");

const PLAIN_CSS_NEXT = [
  ":root {",
  "  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;",
  "}",
  "",
  ".page {",
  "  max-width: 1280px;",
  "  margin: 0 auto;",
  "  padding: 2rem;",
  "  text-align: center;",
  "}",
  "",
].join("\n");

/** Content of the main stylesheet for the chosen styling. */
export function stylesheetFor(config: ProjectConfig): string {
  if (config.styling === "tailwind") return TAILWIND_CSS;
  return config.framework === "next" ? PLAIN_CSS_NEXT : PLAIN_CSS_VITE;
}

/** Path of the main stylesheet for the chosen framework. */
export function stylesheetPath(config: ProjectConfig): string {
  switch (config.framework) {
    case "next":
      return "app/globals.css";
    case "qwik":
      // Qwik's root component imports ./global.css.
      return "src/global.css";
    default:
      // react, vue, svelte, solid, astro and angular all resolve src/styles.css
      // (astro's layout imports ../styles.css; angular.json lists src/styles.css).
      return "src/styles.css";
  }
}

/** Frameworks with no first-class CSS Modules story in this release. */
function requireCssModulesSupport(framework: Framework): void {
  if (
    framework === "svelte" ||
    framework === "solid" ||
    framework === "qwik" ||
    framework === "astro"
  ) {
    throw new ValidationError(
      `CSS Modules styling is not supported for ${framework} projects yet.`,
      { hint: "Use --styling tailwind or --styling plain for this framework." },
    );
  }
}

/** File map fragment for the CSS Modules overlay, per framework. */
export function cssModulesFiles(config: ProjectConfig): Record<string, string> {
  requireCssModulesSupport(config.framework);
  const lang = config.language === "typescript" ? "typescript" : "javascript";

  if (config.framework === "next") {
    const pageModuleCss = [
      ".page {",
      "  max-width: 1280px;",
      "  margin: 0 auto;",
      "  padding: 2rem;",
      "  text-align: center;",
      "}",
      "",
    ].join("\n");
    const ext = lang === "typescript" ? "tsx" : "jsx";
    const page = [
      'import styles from "./page.module.css";',
      "",
      "export default function Home() {",
      "  return (",
      "    <main className={styles.page}>",
      `      <h1>Next.js + ${lang === "typescript" ? "TypeScript" : "JavaScript"} + CSS Modules</h1>`,
      "      <p>",
      `        Edit <code>app/page.${ext}</code> and save to test HMR.`,
      "      </p>",
      "    </main>",
      "  );",
      "}",
      "",
    ].join("\n");
    return {
      "app/page.module.css": pageModuleCss,
      [`app/page.${ext}`]: page,
    };
  }

  if (config.framework === "vue") {
    // Vue's idiomatic CSS Modules form: a <style module> block inside the
    // SFC, consumed through `$style` — no separate .module.css file.
    const script = lang === "typescript" ? '<script setup lang="ts">' : "<script setup>";
    const title = `Vue + Vite + ${lang === "typescript" ? "TypeScript" : "JavaScript"} + CSS Modules`;
    const appVue = [
      script,
      'import { ref } from "vue";',
      "",
      "const count = ref(0);",
      "</script>",
      "",
      "<template>",
      '  <main :class="$style.app">',
      `    <h1>${title}</h1>`,
      "    <p>",
      "      Edit <code>src/App.vue</code> and save to test HMR.",
      "    </p>",
      "    <button",
      '      type="button"',
      '      @click="count++"',
      "    >",
      "      count is {{ count }}",
      "    </button>",
      "  </main>",
      "</template>",
      "",
      "<style module>",
      ".app {",
      "  max-width: 1280px;",
      "  margin: 0 auto;",
      "  padding: 2rem;",
      "  text-align: center;",
      "}",
      "</style>",
      "",
    ].join("\n");
    return { "src/App.vue": appVue };
  }

  if (config.framework === "angular") {
    // Angular's idiomatic scoping IS component styles: the app component is
    // re-emitted with the module CSS inlined via the `styles` option.
    const appTs = [
      'import { Component, signal } from "@angular/core";',
      "",
      "@Component({",
      '  selector: "app-root",',
      '  templateUrl: "./app.html",',
      "  styles: [",
      "    `",
      "      .app {",
      "        max-width: 1280px;",
      "        margin: 0 auto;",
      "        padding: 2rem;",
      "        text-align: center;",
      "      }",
      "    `,",
      "  ],",
      "})",
      "export class App {",
      "  protected readonly count = signal(0);",
      "}",
      "",
    ].join("\n");
    return { "src/app/app.ts": appTs };
  }

  const appModuleCss = [
    ".app {",
    "  max-width: 1280px;",
    "  margin: 0 auto;",
    "  padding: 2rem;",
    "  text-align: center;",
    "}",
    "",
  ].join("\n");
  const ext = config.framework === "react" ? (lang === "typescript" ? "tsx" : "jsx") : "";
  const app = [
    'import styles from "./App.module.css";',
    "",
    "export default function App() {",
    "  return (",
    "    <main className={styles.app}>",
    `      <h1>React + Vite + ${lang === "typescript" ? "TypeScript" : "JavaScript"} + CSS Modules</h1>`,
    "      <p>",
    `        Edit <code>src/App.${ext}</code> and save to test HMR.`,
    "      </p>",
    "    </main>",
    "  );",
    "}",
    "",
  ].join("\n");
  return {
    "src/App.module.css": appModuleCss,
    [`src/App.${ext}`]: app,
  };
}

// ---------------------------------------------------------------------------
// ESLint flat configs
// ---------------------------------------------------------------------------

const ESLINT_REACT_TS = [
  'import js from "@eslint/js";',
  'import globals from "globals";',
  'import reactHooks from "eslint-plugin-react-hooks";',
  'import tseslint from "typescript-eslint";',
  "",
  "export default tseslint.config(",
  '  { ignores: ["dist", "coverage"] },',
  "  js.configs.recommended,",
  "  ...tseslint.configs.recommended,",
  "  {",
  '    files: ["**/*.{ts,tsx}"],',
  "    languageOptions: {",
  "      ecmaVersion: 2022,",
  "      globals: globals.browser,",
  "    },",
  '    plugins: { "react-hooks": reactHooks },',
  "    rules: {",
  "      ...reactHooks.configs.recommended.rules,",
  "    },",
  "  },",
  ");",
  "",
].join("\n");

const ESLINT_REACT_JS = [
  'import js from "@eslint/js";',
  'import globals from "globals";',
  'import reactHooks from "eslint-plugin-react-hooks";',
  "",
  "export default [",
  '  { ignores: ["dist", "coverage"] },',
  "  js.configs.recommended,",
  "  {",
  '    files: ["**/*.{js,jsx}"],',
  "    languageOptions: {",
  "      ecmaVersion: 2022,",
  '      sourceType: "module",',
  "      globals: globals.browser,",
  "      parserOptions: { ecmaFeatures: { jsx: true } },",
  "    },",
  '    plugins: { "react-hooks": reactHooks },',
  "    rules: {",
  "      ...reactHooks.configs.recommended.rules,",
  "      // espree (JS) does not track JSX references, so capitalized JSX",
  "      // components look unused to no-unused-vars - the same workaround",
  "      // create-vite ships for its React JavaScript template.",
  '      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],',
  "    },",
  "  },",
  "];",
  "",
].join("\n");

const ESLINT_NEXT = [
  // eslint-config-next 16+ exports flat-config arrays directly — import them
  // like create-next-app does. (Routing them through the FlatCompat bridge
  // crashes: the legacy resolver cannot represent flat plugin objects.)
  'import nextCoreWebVitals from "eslint-config-next/core-web-vitals";',
  'import nextTypescript from "eslint-config-next/typescript";',
  "",
  "const eslintConfig = [",
  "  ...nextCoreWebVitals,",
  "  ...nextTypescript,",
  '  { ignores: [".next", "out", "node_modules"] },',
  "];",
  "",
  "export default eslintConfig;",
  "",
].join("\n");

const ESLINT_VUE_TS = [
  'import js from "@eslint/js";',
  'import globals from "globals";',
  'import pluginVue from "eslint-plugin-vue";',
  'import tseslint from "typescript-eslint";',
  "",
  "export default tseslint.config(",
  '  { ignores: ["dist", "coverage"] },',
  "  js.configs.recommended,",
  "  ...tseslint.configs.recommended,",
  '  ...pluginVue.configs["flat/recommended"],',
  "  {",
  '    files: ["**/*.vue", "**/*.ts"],',
  "    languageOptions: {",
  "      ecmaVersion: 2022,",
  "      globals: globals.browser,",
  "    },",
  "  },",
  "  {",
  '    files: ["**/*.vue"],',
  "    languageOptions: {",
  "      parserOptions: { parser: tseslint.parser },",
  "    },",
  "  },",
  ");",
  "",
].join("\n");

const ESLINT_VUE_JS = [
  'import js from "@eslint/js";',
  'import globals from "globals";',
  'import pluginVue from "eslint-plugin-vue";',
  "",
  "export default [",
  '  { ignores: ["dist", "coverage"] },',
  "  js.configs.recommended,",
  '  ...pluginVue.configs["flat/recommended"],',
  "  {",
  '    files: ["**/*.vue", "**/*.js"],',
  "    languageOptions: {",
  "      ecmaVersion: 2022,",
  "      globals: globals.browser,",
  "    },",
  "  },",
  "];",
  "",
].join("\n");

const ESLINT_SVELTE_TS = [
  'import js from "@eslint/js";',
  'import globals from "globals";',
  'import pluginSvelte from "eslint-plugin-svelte";',
  'import tseslint from "typescript-eslint";',
  "",
  "export default tseslint.config(",
  '  { ignores: ["dist", "coverage"] },',
  "  js.configs.recommended,",
  "  ...tseslint.configs.recommended,",
  '  ...pluginSvelte.configs["flat/recommended"],',
  "  {",
  "    languageOptions: {",
  "      ecmaVersion: 2022,",
  "      globals: globals.browser,",
  "    },",
  "  },",
  ");",
  "",
].join("\n");

const ESLINT_SVELTE_JS = [
  'import js from "@eslint/js";',
  'import globals from "globals";',
  'import pluginSvelte from "eslint-plugin-svelte";',
  "",
  "export default [",
  '  { ignores: ["dist", "coverage"] },',
  "  js.configs.recommended,",
  '  ...pluginSvelte.configs["flat/recommended"],',
  "  {",
  "    languageOptions: {",
  "      ecmaVersion: 2022,",
  "      globals: globals.browser,",
  "    },",
  "  },",
  "];",
  "",
].join("\n");

function eslintSolid(language: "typescript" | "javascript"): string {
  if (language === "typescript") {
    return [
      'import js from "@eslint/js";',
      'import globals from "globals";',
      'import tseslint from "typescript-eslint";',
      "",
      "export default tseslint.config(",
      '  { ignores: ["dist", "coverage"] },',
      "  js.configs.recommended,",
      "  ...tseslint.configs.recommended,",
      "  {",
      '    files: ["**/*.{ts,tsx}"],',
      "    languageOptions: {",
      "      ecmaVersion: 2022,",
      "      globals: globals.browser,",
      "    },",
      "  },",
      ");",
      "",
    ].join("\n");
  }
  return [
    'import js from "@eslint/js";',
    'import globals from "globals";',
    "",
    "export default [",
    '  { ignores: ["dist", "coverage"] },',
    "  js.configs.recommended,",
    "  {",
    '    files: ["**/*.{js,jsx}"],',
    "    languageOptions: {",
    "      ecmaVersion: 2022,",
    '      sourceType: "module",',
    "      globals: globals.browser,",
    "      parserOptions: { ecmaFeatures: { jsx: true } },",
    "    },",
    "    rules: {",
    "      // espree (JS) does not track JSX references, so capitalized JSX",
    "      // components look unused to no-unused-vars — the same workaround",
    "      // create-vite ships for its React JavaScript template.",
    '      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],',
    "    },",
    "  },",
    "];",
    "",
  ].join("\n");
}

function eslintQwik(language: "typescript" | "javascript"): string {
  const ts = language === "typescript";
  if (ts) {
    // Qwik's rules are type-aware: register the plugin flat-style (the
    // default export's configs.recommended is a legacy eslintrc OBJECT —
    // spreading it directly throws), scope typed parsing to source files so
    // eslint.config.mjs stays outside the project service, and reuse the
    // legacy object's rule map.
    return [
      'import js from "@eslint/js";',
      'import globals from "globals";',
      'import qwikPlugin from "eslint-plugin-qwik";',
      'import tseslint from "typescript-eslint";',
      "",
      "export default tseslint.config(",
      '  { ignores: ["dist", "coverage", "server", "tmp", "qwik"] },',
      "  js.configs.recommended,",
      "  ...tseslint.configs.recommended,",
      "  {",
      '    files: ["**/*.{ts,tsx}"],',
      "    languageOptions: {",
      "      ecmaVersion: 2022,",
      "      globals: globals.browser,",
      "      parserOptions: {",
      "        projectService: true,",
      "        tsconfigRootDir: import.meta.dirname,",
      "      },",
      "    },",
      "    plugins: { qwik: qwikPlugin },",
      "    rules: {",
      "      ...qwikPlugin.configs.recommended.rules,",
      "    },",
      "  },",
      ");",
      "",
    ].join("\n");
  }
  // JavaScript slice: Qwik's rules require TypeScript parser services, so
  // they are intentionally omitted there.
  return [
    'import js from "@eslint/js";',
    'import globals from "globals";',
    "",
    "export default [",
    '  { ignores: ["dist", "coverage", "server", "tmp", "qwik"] },',
    "  js.configs.recommended,",
    "  {",
    '    files: ["**/*.{js,jsx}"],',
    "    languageOptions: {",
    "      ecmaVersion: 2022,",
    '      sourceType: "module",',
    "      globals: globals.browser,",
    "      parserOptions: { ecmaFeatures: { jsx: true } },",
    "    },",
    "    rules: {",
    "      // espree (JS) does not track JSX references, so capitalized JSX",
    "      // components look unused to no-unused-vars — the same workaround",
    "      // create-vite ships for its React JavaScript template.",
    '      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],',
    "    },",
    "  },",
    "];",
    "",
  ].join("\n");
}

function eslintAstro(): string {
  return [
    'import js from "@eslint/js";',
    'import pluginAstro from "eslint-plugin-astro";',
    "",
    "export default [",
    '  { ignores: ["dist", "coverage", ".astro"] },',
    "  js.configs.recommended,",
    "  ...pluginAstro.configs.recommended,",
    "];",
    "",
  ].join("\n");
}

const ESLINT_ANGULAR = [
  "// @ts-check",
  'import eslint from "@eslint/js";',
  'import tseslint from "typescript-eslint";',
  'import angular from "angular-eslint";',
  "",
  "export default tseslint.config(",
  '  { ignores: ["dist", "coverage", ".angular"] },',
  "  {",
  '    files: ["**/*.ts"],',
  "    extends: [",
  "      eslint.configs.recommended,",
  "      ...tseslint.configs.recommended,",
  "      ...angular.configs.tsRecommended,",
  "    ],",
  "    languageOptions: {",
  "      parserOptions: {",
  "        projectService: true,",
  "        tsconfigRootDir: import.meta.dirname,",
  "      },",
  "    },",
  "    rules: {",
  '      "@angular-eslint/directive-selector": [',
  '        "error",',
  '        { type: "attribute", prefix: "app", style: "camelCase" },',
  "      ],",
  '      "@angular-eslint/component-selector": [',
  '        "error",',
  '        { type: "element", prefix: "app", style: "kebab-case" },',
  "      ],",
  "    },",
  "  },",
  "  {",
  '    files: ["**/*.html"],',
  "    extends: [...angular.configs.templateRecommended],",
  "  },",
  ");",
  "",
].join("\n");

/** Content of eslint.config.mjs for the chosen framework/language. */
export function eslintConfigFor(config: ProjectConfig): string {
  switch (config.framework) {
    case "next":
      return ESLINT_NEXT;
    case "vue":
      return config.language === "typescript" ? ESLINT_VUE_TS : ESLINT_VUE_JS;
    case "svelte":
      return config.language === "typescript" ? ESLINT_SVELTE_TS : ESLINT_SVELTE_JS;
    case "solid":
      return eslintSolid(config.language);
    case "qwik":
      return eslintQwik(config.language);
    case "astro":
      return eslintAstro();
    case "angular":
      return ESLINT_ANGULAR;
    default:
      return config.language === "typescript" ? ESLINT_REACT_TS : ESLINT_REACT_JS;
  }
}

/**
 * Framework wiring files for the Tailwind overlay: Vite-plugin based for
 * react/vue/svelte/solid/qwik, PostCSS based for next and angular, and
 * `vite.plugins` inside astro.config for astro. Without these the
 * `@import "tailwindcss"` stylesheet is never compiled — generated projects
 * would build but ship unstyled.
 */
export function tailwindConfigFiles(config: ProjectConfig): Record<string, string> {
  switch (config.framework) {
    case "next":
      return {
        "postcss.config.mjs": [
          "export default {",
          "  plugins: {",
          '    "@tailwindcss/postcss": {},',
          "  },",
          "};",
          "",
        ].join("\n"),
      };
    case "astro":
      return {
        "astro.config.mjs": [
          'import { defineConfig } from "astro/config";',
          'import tailwindcss from "@tailwindcss/vite";',
          "",
          "// https://astro.build/config",
          "export default defineConfig({",
          "  vite: {",
          "    plugins: [tailwindcss()],",
          "  },",
          "});",
          "",
        ].join("\n"),
      };
    case "qwik": {
      const qwikConfig = (): string =>
        [
          'import { defineConfig } from "vite";',
          'import { qwikVite } from "@builder.io/qwik/optimizer";',
          'import { qwikCity } from "@builder.io/qwik-city/vite";',
          'import tailwindcss from "@tailwindcss/vite";',
          "",
          "export default defineConfig(() => {",
          "  return {",
          "    plugins: [qwikCity(), qwikVite(), tailwindcss()],",
          "    preview: {",
          "      headers: {",
          '        "Cache-Control": "public, max-age=600",',
          "      },",
          "    },",
          "  };",
          "});",
          "",
        ].join("\n");
      const path = config.language === "typescript" ? "vite.config.ts" : "vite.config.js";
      return { [path]: qwikConfig() };
    }
    case "svelte": {
      const path = config.language === "typescript" ? "vite.config.ts" : "vite.config.js";
      return {
        [path]:
          config.language === "typescript" ? svelteViteConfigTs(true) : svelteViteConfigJs(true),
      };
    }
    case "solid": {
      const path = config.language === "typescript" ? "vite.config.ts" : "vite.config.js";
      return {
        [path]:
          config.language === "typescript" ? solidViteConfigTs(true) : solidViteConfigJs(true),
      };
    }
    case "angular":
      // Angular consumes Tailwind through its built-in PostCSS pipeline
      // (documented at tailwind.angular.dev): a .postcssrc.json plus the
      // @import in src/styles.css — no vite.config or angular.json change.
      return {
        ".postcssrc.json": [
          "{",
          '  "plugins": {',
          '    "@tailwindcss/postcss": {}',
          "  }",
          "}",
          "",
        ].join("\n"),
      };
    default: {
      // react and vue share the generic Vite plugin shape.
      const pluginImport = config.framework === "vue" ? "vue" : "react";
      const viteConfig = [
        'import { defineConfig } from "vite";',
        `import ${pluginImport} from "@vitejs/plugin-${pluginImport}";`,
        'import tailwindcss from "@tailwindcss/vite";',
        "",
        "// https://vite.dev/config/",
        "export default defineConfig({",
        `  plugins: [${pluginImport}(), tailwindcss()],`,
        "});",
        "",
      ].join("\n");
      const path = config.language === "typescript" ? "vite.config.ts" : "vite.config.js";
      return { [path]: viteConfig };
    }
  }
}

const PRETTIERRC = [
  "{",
  '  "semi": true,',
  '  "singleQuote": false,',
  '  "trailingComma": "all",',
  '  "printWidth": 100,',
  '  "tabWidth": 2',
  "}",
  "",
].join("\n");

const PRETTIERRC_SVELTE = [
  "{",
  '  "semi": true,',
  '  "singleQuote": false,',
  '  "trailingComma": "all",',
  '  "printWidth": 100,',
  '  "tabWidth": 2,',
  '  "plugins": ["prettier-plugin-svelte"],',
  '  "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]',
  "}",
  "",
].join("\n");

const PRETTIERRC_ASTRO = [
  "{",
  '  "semi": true,',
  '  "singleQuote": false,',
  '  "trailingComma": "all",',
  '  "printWidth": 100,',
  '  "tabWidth": 2,',
  '  "plugins": ["prettier-plugin-astro"]',
  "}",
  "",
].join("\n");

/** Content of .prettierignore for the chosen framework. */
function prettierIgnoreFor(config: ProjectConfig): string {
  const lines = [
    "dist/",
    "build/",
    "coverage/",
    "node_modules/",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lockb",
  ];
  if (config.framework === "next") lines.push(".next/", "out/");
  if (config.framework === "astro") lines.push(".astro/");
  if (config.framework === "angular") lines.push(".angular/");
  if (config.framework === "qwik") lines.push("tmp/", "server/");
  lines.push("");
  return lines.join("\n");
}

/** File map fragment for the Prettier overlay. */
export function prettierFiles(config: ProjectConfig): Record<string, string> {
  const prettierrc =
    config.framework === "svelte"
      ? PRETTIERRC_SVELTE
      : config.framework === "astro"
        ? PRETTIERRC_ASTRO
        : PRETTIERRC;
  return {
    ".prettierrc.json": prettierrc,
    ".prettierignore": prettierIgnoreFor(config),
  };
}
