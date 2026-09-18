import type { TemplatePart } from "../../types.js";

/**
 * Next.js (App Router) source files, TypeScript slice. Next serves global CSS
 * from the root layout; the styling part overrides `app/layout.tsx` when the
 * stylesheet import lives there.
 */

const TSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2022",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: { "@/*": ["./*"] },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  },
  null,
  2,
);

const NEXT_CONFIG_TS = [
  'import type { NextConfig } from "next";',
  "",
  "const nextConfig: NextConfig = {",
  "  /* config options here */",
  "};",
  "",
  "export default nextConfig;",
  "",
].join("\n");

const LAYOUT_TSX = [
  'import type { Metadata } from "next";',
  'import "./globals.css";',
  "",
  "export const metadata: Metadata = {",
  '  title: "frontend-starter · next",',
  '  description: "A Next.js project generated with frontend-starter.",',
  "};",
  "",
  "export default function RootLayout({",
  "  children,",
  "}: Readonly<{",
  "  children: React.ReactNode;",
  "}>) {",
  "  return (",
  '    <html lang="en">',
  "      <body>{children}</body>",
  "    </html>",
  "  );",
  "}",
  "",
].join("\n");

const PAGE_TSX = [
  "export default function Home() {",
  "  return (",
  '    <main className="page">',
  "      <h1>Next.js + TypeScript</h1>",
  "      <p>",
  "        Edit <code>app/page.tsx</code> and save to test HMR.",
  "      </p>",
  "    </main>",
  "  );",
  "}",
  "",
].join("\n");

export function nextTsPart(): TemplatePart {
  return {
    id: "next/_ts",
    files: {
      "tsconfig.json": TSCONFIG,
      "next.config.ts": NEXT_CONFIG_TS,
      "app/layout.tsx": LAYOUT_TSX,
      "app/page.tsx": PAGE_TSX,
      "app/globals.css": "/* replaced by the styling part */\n",
      "public/.gitkeep": "",
    },
  };
}
