import type { TemplatePart } from "../../types.js";

/**
 * React (Vite) source files, TypeScript slice. The CSS import keeps the
 * styling overlay slot explicit — the styling part replaces this file.
 */

const VITE_CONFIG_TS = [
  'import { defineConfig } from "vite";',
  'import react from "@vitejs/plugin-react";',
  "",
  "// https://vite.dev/config/",
  "export default defineConfig({",
  "  plugins: [react()],",
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
      jsx: "react-jsx",
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
  "    <title>frontend-starter · react</title>",
  "  </head>",
  "  <body>",
  '    <div id="root"></div>',
  '    <script type="module" src="/src/main.tsx"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

const MAIN_TSX = [
  'import { StrictMode } from "react";',
  'import { createRoot } from "react-dom/client";',
  'import App from "./App.tsx";',
  'import "./styles.css";',
  "",
  'createRoot(document.getElementById("root")!).render(',
  "  <StrictMode>",
  "    <App />",
  "  </StrictMode>,",
  ");",
  "",
].join("\n");

const APP_TSX = [
  "export default function App() {",
  "  return (",
  '    <main className="app">',
  "      <h1>React + Vite + TypeScript</h1>",
  "      <p>",
  "        Edit <code>src/App.tsx</code> and save to test HMR.",
  "      </p>",
  "    </main>",
  "  );",
  "}",
  "",
].join("\n");

export function reactTsPart(): TemplatePart {
  return {
    id: "react/_ts",
    files: {
      "index.html": INDEX_HTML,
      "vite.config.ts": VITE_CONFIG_TS,
      "tsconfig.json": TSCONFIG,
      "tsconfig.node.json": TSCONFIG_NODE,
      "src/vite-env.d.ts": ['/// <reference types="vite/client" />', ""].join("\n"),
      "src/main.tsx": MAIN_TSX,
      "src/App.tsx": APP_TSX,
    },
  };
}
