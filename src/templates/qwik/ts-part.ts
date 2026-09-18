import type { TemplatePart } from "../../types.js";

/**
 * Qwik + Qwik City source files, TypeScript slice (CSR-first base, mirroring
 * create-qwik's minimal starter). No tsconfig path aliases, so the vite
 * config needs no tsconfig-paths plugin.
 */

const VITE_CONFIG = [
  'import { defineConfig } from "vite";',
  'import { qwikVite } from "@builder.io/qwik/optimizer";',
  'import { qwikCity } from "@builder.io/qwik-city/vite";',
  "",
  "export default defineConfig(() => {",
  "  return {",
  "    plugins: [qwikCity(), qwikVite()],",
  "    preview: {",
  "      headers: {",
  '        "Cache-Control": "public, max-age=600",',
  "      },",
  "    },",
  "  };",
  "});",
  "",
].join("\n");

const TSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      allowJs: true,
      target: "ES2017",
      module: "ES2020",
      lib: ["es2020", "DOM", "WebWorker", "DOM.Iterable"],
      jsx: "react-jsx",
      jsxImportSource: "@builder.io/qwik",
      strict: true,
      verbatimModuleSyntax: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      moduleResolution: "bundler",
      esModuleInterop: true,
      skipLibCheck: true,
      incremental: true,
      isolatedModules: true,
      outDir: "tmp",
      noEmit: true,
      types: ["node", "vite/client"],
    },
    include: ["src", "vite.config.ts"],
  },
  null,
  2,
);

const ROOT_TSX = [
  'import { component$ } from "@builder.io/qwik";',
  'import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";',
  'import "./global.css";',
  "",
  "export default component$(() => {",
  "  return (",
  "    <QwikCityProvider>",
  "      <head>",
  '        <meta charset="utf-8" />',
  '        <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  "        <title>frontend-starter · qwik</title>",
  "      </head>",
  '      <body lang="en">',
  "        <RouterOutlet />",
  "      </body>",
  "    </QwikCityProvider>",
  "  );",
  "});",
  "",
].join("\n");

const ENTRY_SSR = [
  'import { renderToStream, type RenderToStreamOptions } from "@builder.io/qwik/server";',
  'import Root from "./root";',
  "",
  "export default function (opts: RenderToStreamOptions) {",
  "  return renderToStream(<Root />, opts);",
  "}",
  "",
].join("\n");

const ENTRY_PREVIEW = [
  'import { createQwikCity } from "@builder.io/qwik-city/middleware/node";',
  'import qwikCityPlan from "@qwik-city-plan";',
  'import render from "./entry.ssr";',
  "",
  "/**",
  " * The default export is the QwikCity adapter used by `vite preview`.",
  " */",
  "export default createQwikCity({ render, qwikCityPlan });",
  "",
].join("\n");

const ROUTE_INDEX = [
  'import { component$ } from "@builder.io/qwik";',
  "",
  "export default component$(() => {",
  "  return (",
  '    <main class="app">',
  "      <h1>Qwik + Qwik City + TypeScript</h1>",
  "      <p>",
  "        Edit <code>src/routes/index.tsx</code> and save to test HMR.",
  "      </p>",
  "    </main>",
  "  );",
  "});",
  "",
].join("\n");

const ROUTE_LAYOUT = [
  'import { component$, Slot } from "@builder.io/qwik";',
  "",
  "export default component$(() => {",
  "  return <Slot />;",
  "});",
  "",
].join("\n");

export function qwikTsPart(): TemplatePart {
  return {
    id: "qwik/_ts",
    files: {
      "vite.config.ts": VITE_CONFIG,
      "tsconfig.json": TSCONFIG,
      "src/root.tsx": ROOT_TSX,
      "src/entry.ssr.tsx": ENTRY_SSR,
      "src/entry.preview.tsx": ENTRY_PREVIEW,
      "src/routes/layout.tsx": ROUTE_LAYOUT,
      "src/routes/index.tsx": ROUTE_INDEX,
    },
  };
}
