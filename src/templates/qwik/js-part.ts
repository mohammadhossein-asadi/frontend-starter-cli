import type { TemplatePart } from "../../types.js";

/**
 * Qwik + Qwik City source files, JavaScript slice. Mirrors the TypeScript
 * slice minus tsconfig and typed entry points.
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

const ROOT_JSX = [
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
  'import { renderToStream } from "@builder.io/qwik/server";',
  'import Root from "./root";',
  "",
  "export default function (opts) {",
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
  "      <h1>Qwik + Qwik City + JavaScript</h1>",
  "      <p>",
  "        Edit <code>src/routes/index.jsx</code> and save to test HMR.",
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

export function qwikJsPart(): TemplatePart {
  return {
    id: "qwik/_js",
    files: {
      "vite.config.js": VITE_CONFIG,
      "src/root.jsx": ROOT_JSX,
      "src/entry.ssr.jsx": ENTRY_SSR,
      "src/entry.preview.jsx": ENTRY_PREVIEW,
      "src/routes/layout.jsx": ROUTE_LAYOUT,
      "src/routes/index.jsx": ROUTE_INDEX,
    },
  };
}
