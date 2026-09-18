import type { TemplatePart } from "../../types.js";

/**
 * Svelte 5 (Vite) source files, TypeScript slice. `viteConfig()` is exported
 * so the Tailwind overlay can re-emit the config with the plugin added from
 * the same source of truth.
 */

export function viteConfig(withTailwind: boolean): string {
  return [
    'import { defineConfig } from "vite";',
    ...(withTailwind ? ['import tailwindcss from "@tailwindcss/vite";'] : []),
    'import { svelte } from "@sveltejs/vite-plugin-svelte";',
    "",
    "export default defineConfig({",
    withTailwind ? "  plugins: [tailwindcss(), svelte()]," : "  plugins: [svelte()],",
    "});",
    "",
  ].join("\n");
}

const SVELTE_CONFIG = [
  'import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";',
  "",
  "export default {",
  "  preprocess: vitePreprocess(),",
  "};",
  "",
].join("\n");

const TSCONFIG = JSON.stringify(
  {
    extends: "@tsconfig/svelte/tsconfig.json",
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      module: "ESNext",
      resolveJsonModule: true,
      allowJs: true,
      checkJs: true,
      isolatedModules: true,
      moduleDetection: "force",
      strict: true,
      noEmit: true,
    },
    include: ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte", "vite.config.ts"],
  },
  null,
  2,
);

const INDEX_HTML = [
  "<!doctype html>",
  '<html lang="en">',
  "  <head>",
  '    <meta charset="UTF-8" />',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  "    <title>frontend-starter · svelte</title>",
  "  </head>",
  "  <body>",
  '    <div id="app"></div>',
  '    <script type="module" src="/src/main.ts"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const MAIN_TS = [
  'import { mount } from "svelte";',
  'import "./styles.css";',
  'import App from "./App.svelte";',
  "",
  "const app = mount(App, {",
  '  target: document.getElementById("app")!,',
  "});",
  "",
  "export default app;",
  "",
].join("\n");

const APP_SVELTE = [
  '<script lang="ts">',
  "  let count = $state(0);",
  "</script>",
  "",
  '<main class="app">',
  "  <h1>Svelte + Vite + TypeScript</h1>",
  "  <p>",
  "    Edit <code>src/App.svelte</code> and save to test HMR.",
  "  </p>",
  '  <button type="button" onclick={() => count++}>',
  "    count is {count}",
  "  </button>",
  "</main>",
  "",
].join("\n");

const VITE_ENV_D_TS = [
  '/// <reference types="svelte" />',
  '/// <reference types="vite/client" />',
  "",
].join("\n");

export function svelteTsPart(): TemplatePart {
  return {
    id: "svelte/_ts",
    files: {
      "vite.config.ts": viteConfig(false),
      "svelte.config.js": SVELTE_CONFIG,
      "tsconfig.json": TSCONFIG,
      "index.html": INDEX_HTML,
      "src/vite-env.d.ts": VITE_ENV_D_TS,
      "src/main.ts": MAIN_TS,
      "src/App.svelte": APP_SVELTE,
    },
  };
}
