import type { TemplatePart } from "../../types.js";

/**
 * SolidJS (Vite) source files, TypeScript slice. `viteConfig()` is exported
 * so the Tailwind overlay can re-emit the config with the plugin added from
 * the same source of truth.
 */

export function viteConfig(withTailwind: boolean): string {
  return [
    'import { defineConfig } from "vite";',
    ...(withTailwind ? ['import tailwindcss from "@tailwindcss/vite";'] : []),
    'import solid from "vite-plugin-solid";',
    "",
    "export default defineConfig({",
    withTailwind ? "  plugins: [tailwindcss(), solid()]," : "  plugins: [solid()],",
    "});",
    "",
  ].join("\n");
}

const TSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      allowImportingTsExtensions: true,
      verbatimModuleSyntax: true,
      moduleDetection: "force",
      noEmit: true,
      jsx: "preserve",
      jsxImportSource: "solid-js",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
      types: ["vite/client"],
    },
    include: ["src", "vite.config.ts"],
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
  "    <title>frontend-starter · solid</title>",
  "  </head>",
  "  <body>",
  '    <div id="root"></div>',
  '    <script type="module" src="/src/index.tsx"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const INDEX_TSX = [
  'import { render } from "solid-js/web";',
  'import "./styles.css";',
  'import App from "./App";',
  "",
  'const root = document.getElementById("root");',
  "",
  "render(() => <App />, root!);",
  "",
].join("\n");

const APP_TSX = [
  'import type { Component } from "solid-js";',
  "",
  'import { createSignal } from "solid-js";',
  "",
  "const App: Component = () => {",
  "  const [count, setCount] = createSignal(0);",
  "  return (",
  '    <main class="app">',
  "      <h1>Solid + Vite + TypeScript</h1>",
  "      <p>",
  "        Edit <code>src/App.tsx</code> and save to test HMR.",
  "      </p>",
  '      <button type="button" onClick={() => setCount(count() + 1)}>',
  "        count is {count()}",
  "      </button>",
  "    </main>",
  "  );",
  "};",
  "",
  "export default App;",
  "",
].join("\n");

export function solidTsPart(): TemplatePart {
  return {
    id: "solid/_ts",
    files: {
      "index.html": INDEX_HTML,
      "vite.config.ts": viteConfig(false),
      "tsconfig.json": TSCONFIG,
      "src/index.tsx": INDEX_TSX,
      "src/App.tsx": APP_TSX,
    },
  };
}
