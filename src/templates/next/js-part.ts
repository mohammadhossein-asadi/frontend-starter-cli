import type { TemplatePart } from "../../types.js";

/**
 * Next.js (App Router) source files, JavaScript slice. `jsconfig.json` gives
 * the same `@/*` path alias the TS slice gets from tsconfig.
 */

const JSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      paths: { "@/*": ["./*"] },
    },
  },
  null,
  2,
);

const NEXT_CONFIG_MJS = [
  "/** @type {import('next').NextConfig} */",
  "const nextConfig = {",
  "  /* config options here */",
  "};",
  "",
  "export default nextConfig;",
  "",
].join("\n");

const LAYOUT_JSX = [
  'import "./globals.css";',
  "",
  "export const metadata = {",
  '  title: "frontend-starter · next",',
  '  description: "A Next.js project generated with frontend-starter.",',
  "};",
  "",
  "export default function RootLayout({ children }) {",
  "  return (",
  '    <html lang="en">',
  "      <body>{children}</body>",
  "    </html>",
  "  );",
  "}",
  "",
].join("\n");

const PAGE_JSX = [
  "export default function Home() {",
  "  return (",
  '    <main className="page">',
  "      <h1>Next.js + JavaScript</h1>",
  "      <p>",
  "        Edit <code>app/page.jsx</code> and save to test HMR.",
  "      </p>",
  "    </main>",
  "  );",
  "}",
  "",
].join("\n");

export function nextJsPart(): TemplatePart {
  return {
    id: "next/_js",
    files: {
      "jsconfig.json": JSCONFIG,
      "next.config.mjs": NEXT_CONFIG_MJS,
      "app/layout.jsx": LAYOUT_JSX,
      "app/page.jsx": PAGE_JSX,
      "app/globals.css": "/* replaced by the styling part */\n",
      "public/.gitkeep": "",
    },
  };
}
