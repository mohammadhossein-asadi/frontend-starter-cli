import type { TemplatePart } from "../../types.js";

/**
 * Vue (Vite) source files, TypeScript slice. The stylesheet import keeps the
 * styling overlay slot explicit — the styling part replaces `src/styles.css`.
 */

const VITE_CONFIG_TS = [
  'import { defineConfig } from "vite";',
  'import vue from "@vitejs/plugin-vue";',
  "",
  "// https://vite.dev/config/",
  "export default defineConfig({",
  "  plugins: [vue()],",
  "});",
  "",
].join("\n");

const TSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      allowImportingTsExtensions: true,
      verbatimModuleSyntax: true,
      moduleDetection: "force",
      noEmit: true,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
    },
    include: ["src", "vite.config.ts"],
  },
  null,
  2,
);

const TSCONFIG_NODE = JSON.stringify(
  {
    compilerOptions: {
      composite: true,
      module: "NodeNext",
      moduleResolution: "NodeNext",
      allowSyntheticDefaultImports: true,
      strict: true,
      noEmit: true,
      types: ["node"],
      skipLibCheck: true,
    },
    include: ["vite.config.ts"],
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
  "    <title>frontend-starter · vue</title>",
  "  </head>",
  "  <body>",
  '    <div id="app"></div>',
  '    <script type="module" src="/src/main.ts"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const MAIN_TS = [
  'import { createApp } from "vue";',
  'import App from "./App.vue";',
  'import "./styles.css";',
  "",
  'createApp(App).mount("#app");',
  "",
].join("\n");

const APP_VUE = [
  '<script setup lang="ts">',
  'import { ref } from "vue";',
  "",
  "const count = ref(0);",
  "</script>",
  "",
  "<template>",
  '  <main class="app">',
  "    <h1>Vue + Vite + TypeScript</h1>",
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

export function vueTsPart(): TemplatePart {
  return {
    id: "vue/_ts",
    files: {
      "index.html": INDEX_HTML,
      "vite.config.ts": VITE_CONFIG_TS,
      "tsconfig.json": TSCONFIG,
      "tsconfig.node.json": TSCONFIG_NODE,
      "src/vite-env.d.ts": ['/// <reference types="vite/client" />', ""].join("\n"),
      "src/main.ts": MAIN_TS,
      "src/App.vue": APP_VUE,
    },
  };
}
