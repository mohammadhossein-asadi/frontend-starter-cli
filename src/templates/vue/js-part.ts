import type { TemplatePart } from "../../types.js";

/**
 * Vue (Vite) source files, JavaScript slice. Mirrors the TypeScript slice
 * without type-checking tooling or TS-specific syntax.
 */

const VITE_CONFIG_JS = [
  'import { defineConfig } from "vite";',
  'import vue from "@vitejs/plugin-vue";',
  "",
  "// https://vite.dev/config/",
  "export default defineConfig({",
  "  plugins: [vue()],",
  "});",
  "",
].join("\n");

const INDEX_HTML = [
  "<!doctype html>",
  '<html lang="en">',
  "  <head>",
  '    <meta charset="UTF-8" />',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  "    <title>frontend-starter · vue</title>",
  "  </head>",
  "  <body>",
  '    <div id="app"></div>',
  '    <script type="module" src="/src/main.js"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const MAIN_JS = [
  'import { createApp } from "vue";',
  'import App from "./App.vue";',
  'import "./styles.css";',
  "",
  'createApp(App).mount("#app");',
  "",
].join("\n");

const APP_VUE = [
  "<script setup>",
  'import { ref } from "vue";',
  "",
  "const count = ref(0);",
  "</script>",
  "",
  "<template>",
  '  <main class="app">',
  "    <h1>Vue + Vite + JavaScript</h1>",
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
].join("\n");

export function vueJsPart(): TemplatePart {
  return {
    id: "vue/_js",
    files: {
      "index.html": INDEX_HTML,
      "vite.config.js": VITE_CONFIG_JS,
      "src/main.js": MAIN_JS,
      "src/App.vue": APP_VUE,
    },
  };
}
