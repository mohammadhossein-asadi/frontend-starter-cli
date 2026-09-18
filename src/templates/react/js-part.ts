import type { TemplatePart } from "../../types.js";

/**
 * React (Vite) source files, JavaScript slice. Same app as the TS slice, no
 * type-checking scaffolding.
 */

const VITE_CONFIG_JS = [
  'import { defineConfig } from "vite";',
  'import react from "@vitejs/plugin-react";',
  "",
  "// https://vite.dev/config/",
  "export default defineConfig({",
  "  plugins: [react()],",
  "});",
  "",
].join("\n");

const INDEX_HTML = [
  "<!doctype html>",
  '<html lang="en">',
  "  <head>",
  '    <meta charset="UTF-8" />',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  "    <title>frontend-starter · react</title>",
  "  </head>",
  "  <body>",
  '    <div id="root"></div>',
  '    <script type="module" src="/src/main.jsx"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const MAIN_JSX = [
  'import { StrictMode } from "react";',
  'import { createRoot } from "react-dom/client";',
  'import App from "./App.jsx";',
  'import "./styles.css";',
  "",
  'createRoot(document.getElementById("root")).render(',
  "  <StrictMode>",
  "    <App />",
  "  </StrictMode>,",
  ");",
  "",
].join("\n");

const APP_JSX = [
  "export default function App() {",
  "  return (",
  '    <main className="app">',
  "      <h1>React + Vite + JavaScript</h1>",
  "      <p>",
  "        Edit <code>src/App.jsx</code> and save to test HMR.",
  "      </p>",
  "    </main>",
  "  );",
  "}",
  "",
].join("\n");

export function reactJsPart(): TemplatePart {
  return {
    id: "react/_js",
    files: {
      "index.html": INDEX_HTML,
      "vite.config.js": VITE_CONFIG_JS,
      "src/main.jsx": MAIN_JSX,
      "src/App.jsx": APP_JSX,
    },
  };
}
