import type { TemplatePart } from "../../types.js";

/**
 * Astro source files, JavaScript slice. Mirrors the TypeScript slice with the
 * base (non-strict) tsconfig and no typed frontmatter.
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
    extends: "astro/tsconfigs/base",
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
  "    <h1>Astro + JavaScript</h1>",
  "    <p>",
  "      Edit <code>src/pages/index.astro</code> and save to test HMR.",
  "    </p>",
  "  </main>",
  "</Layout>",
  "",
].join("\n");

export function astroJsPart(): TemplatePart {
  return {
    id: "astro/_js",
    files: {
      "astro.config.mjs": ASTRO_CONFIG,
      "tsconfig.json": TSCONFIG,
      "src/layouts/Layout.astro": LAYOUT_ASTRO,
      "src/pages/index.astro": INDEX_ASTRO,
    },
  };
}
