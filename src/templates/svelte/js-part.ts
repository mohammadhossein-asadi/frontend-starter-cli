import type { TemplatePart } from "../../types.js";

/**
 * Svelte 5 (Vite) source files, JavaScript slice. Mirrors the TypeScript
 * slice minus tsconfig, type references and typed entry points. `viteConfig()`
 * is exported so the Tailwind overlay can re-emit the config with the plugin
 * added from the same source of truth.
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
  '    <script type="module" src="/src/main.js"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const MAIN_JS = [
  'import { mount } from "svelte";',
  'import "./styles.css";',
  'import App from "./App.svelte";',
  "",
  "const app = mount(App, {",
  '  target: document.getElementById("app"),',
  "});",
  "",
  "export default app;",
  "",
].join("\n");

const APP_SVELTE = [
  "<script>",
  "  let count = $state(0);",
  "</script>",
  "",
  '<main class="app">',
  "  <h1>Svelte + Vite + JavaScript</h1>",
  "  <p>",
  "    Edit <code>src/App.svelte</code> and save to test HMR.",
  "  </p>",
  '  <button type="button" onclick={() => count++}>',
  "    count is {count}",
  "  </button>",
  "</main>",
  "",
].join("\n");

export function svelteJsPart(): TemplatePart {
  return {
    id: "svelte/_js",
    files: {
      "vite.config.js": viteConfig(false),
      "svelte.config.js": SVELTE_CONFIG,
      "index.html": INDEX_HTML,
      "src/main.js": MAIN_JS,
      "src/App.svelte": APP_SVELTE,
    },
  };
}
