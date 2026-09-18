import type { TemplatePart } from "../../types.js";

/**
 * SolidJS (Vite) source files, JavaScript slice. Mirrors the TypeScript
 * slice minus tsconfig and typed entry points. `viteConfig()` is exported so
 * the Tailwind overlay can re-emit the config with the plugin added from the
 * same source of truth.
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
  '    <script type="module" src="/src/index.jsx"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const INDEX_JSX = [
  'import { render } from "solid-js/web";',
  'import "./styles.css";',
  'import App from "./App";',
  "",
  'const root = document.getElementById("root");',
  "",
  "render(() => <App />, root);",
  "",
].join("\n");

const APP_JSX = [
  'import { createSignal } from "solid-js";',
  "",
  "function App() {",
  "  const [count, setCount] = createSignal(0);",
  "  return (",
  '    <main class="app">',
  "      <h1>Solid + Vite + JavaScript</h1>",
  "      <p>",
  "        Edit <code>src/App.jsx</code> and save to test HMR.",
  "      </p>",
  '      <button type="button" onClick={() => setCount(count() + 1)}>',
  "        count is {count()}",
  "      </button>",
  "    </main>",
  "  );",
  "}",
  "",
  "export default App;",
  "",
].join("\n");

export function solidJsPart(): TemplatePart {
  return {
    id: "solid/_js",
    files: {
      "index.html": INDEX_HTML,
      "vite.config.js": viteConfig(false),
      "src/index.jsx": INDEX_JSX,
      "src/App.jsx": APP_JSX,
    },
  };
}
