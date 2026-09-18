import type { TemplatePart } from "../../types.js";

/**
 * Astro source files, TypeScript slice. Astro's build bundles `src/styles.css`
 * because the layout imports it; Tailwind is wired through the Vite plugin.
 */

const ASTRO_CONFIG = [
  'import { defineConfig } from "astro/config";',
  "",
  "// https://astro.build/config",
  "export default defineConfig({});",
  "",
].join("\n");

const TSCONFIG = JSON.stringify(
  {
    extends: "astro/tsconfigs/strict",
    include: [".astro/types.d.ts", "**/*"],
    exclude: ["dist"],
  },
  null,
  2,
);

const LAYOUT_ASTRO = [
  "---",
  'import "../styles.css";',
  "",
  "interface Props {",
  "  title: string;",
  "}",
  "",
  "const { title } = Astro.props;",
  "---",
  "",
  "<!doctype html>",
  '<html lang="en">',
  "  <head>",
  '    <meta charset="UTF-8" />',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  `    <title>{title}</title>`,
  "  </head>",
  "  <body>",
  "    <slot />",
  "  </body>",
  "</html>",
  "",
].join("\n");

const INDEX_ASTRO = [
  "---",
  'import Layout from "../layouts/Layout.astro";',
  "---",
  "",
  '<Layout title="frontend-starter · astro">',
  '  <main class="app">',
  "    <h1>Astro + TypeScript</h1>",
  "    <p>",
  "      Edit <code>src/pages/index.astro</code> and save to test HMR.",
  "    </p>",
  "  </main>",
  "</Layout>",
  "",
].join("\n");

export function astroTsPart(): TemplatePart {
  return {
    id: "astro/_ts",
    files: {
      "astro.config.mjs": ASTRO_CONFIG,
      "tsconfig.json": TSCONFIG,
      "src/layouts/Layout.astro": LAYOUT_ASTRO,
      "src/pages/index.astro": INDEX_ASTRO,
    },
  };
}
