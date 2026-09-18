/** Shared .gitignore text for every generated project. */
export function sharedGitignore(): string {
  return [
    "# dependencies",
    "node_modules/",
    "",
    "# build output",
    "dist/",
    "build/",
    "",
    "# env files",
    ".env",
    ".env.*",
    "!.env.example",
    "",
    "# logs",
    "*.log",
    "npm-debug.log*",
    "pnpm-debug.log*",
    "yarn-error.log*",
    "",
    "# tooling",
    "coverage/",
    ".vitest/",
    "",
    "# editors / OS",
    ".idea/",
    ".vscode/*",
    "!.vscode/extensions.json",
    ".DS_Store",
    "Thumbs.db",
    "",
  ].join("\n");
}

/** Framework-specific additions appended after the shared block. */
export function frameworkGitignore(framework: "react" | "next" | "vue"): string {
  if (framework === "next") {
    return [
      "# next.js",
      ".next/",
      "out/",
      ".vercel/",
      "*.tsbuildinfo",
      "next-env.d.ts.bak",
      "",
    ].join("\n");
  }
  return ["# vite", "*.local", ""].join("\n");
}

export function fullGitignore(framework: "react" | "next" | "vue"): string {
  return `${sharedGitignore()}${frameworkGitignore(framework)}`;
}
