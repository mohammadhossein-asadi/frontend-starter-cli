import type { ProjectConfig } from "../../types.js";

/**
 * Overlay file contents: styling (Tailwind v4 / CSS Modules / plain CSS) and
 * tooling configs (ESLint flat, Prettier). package.json fragments for these
 * live in `../react/package.ts` (shared by both frameworks).
 */

const TAILWIND_CSS = [
  '@import "tailwindcss";',
  "",
  ":root {",
  "  color-scheme: light dark;",
  "}",
  "",
].join("\n");

const PLAIN_CSS_REACT = [
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
  return config.framework === "next" ? PLAIN_CSS_NEXT : PLAIN_CSS_REACT;
}

/** Path of the main stylesheet for the chosen framework. */
export function stylesheetPath(config: ProjectConfig): string {
  return config.framework === "next" ? "app/globals.css" : "src/styles.css";
}

/** File map fragment for the CSS Modules overlay, per framework. */
export function cssModulesFiles(config: ProjectConfig): Record<string, string> {
  const lang = config.language === "typescript" ? "typescript" : "javascript";
  const ext = lang === "typescript" ? "tsx" : "jsx";

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

  const appModuleCss = [
    ".app {",
    "  max-width: 1280px;",
    "  margin: 0 auto;",
    "  padding: 2rem;",
    "  text-align: center;",
    "}",
    "",
  ].join("\n");
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
  "      globals: globals.browser,",
  "    },",
  '    plugins: { "react-hooks": reactHooks },',
  "    rules: {",
  "      ...reactHooks.configs.recommended.rules,",
  "    },",
  "  },",
  "];",
  "",
].join("\n");

const ESLINT_NEXT = [
  'import { FlatCompat } from "@eslint/eslintrc";',
  "",
  "const compat = new FlatCompat({",
  "  baseDirectory: import.meta.dirname,",
  "});",
  "",
  "const eslintConfig = [",
  '  ...compat.extends("next/core-web-vitals", "next/typescript"),',
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

/** Content of eslint.config.mjs for the chosen framework/language. */
export function eslintConfigFor(config: ProjectConfig): string {
  if (config.framework === "next") return ESLINT_NEXT;
  if (config.framework === "vue") {
    return config.language === "typescript" ? ESLINT_VUE_TS : ESLINT_VUE_JS;
  }
  return config.language === "typescript" ? ESLINT_REACT_TS : ESLINT_REACT_JS;
}

/**
 * Framework wiring files for the Tailwind overlay: Vite-plugin based for
 * react/vue, PostCSS based for next. Without these the `@import
 * "tailwindcss"` stylesheet is never compiled — generated projects would
 * build but ship unstyled.
 */
export function tailwindConfigFiles(config: ProjectConfig): Record<string, string> {
  if (config.framework === "next") {
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
  }
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
  lines.push("");
  return lines.join("\n");
}

/** File map fragment for the Prettier overlay. */
export function prettierFiles(config: ProjectConfig): Record<string, string> {
  return {
    ".prettierrc.json": PRETTIERRC,
    ".prettierignore": prettierIgnoreFor(config),
  };
}
