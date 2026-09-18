import type { PackageManager, ProjectConfig } from "../../types.js";

/**
 * README renderer for generated projects. Uses string concatenation for code
 * fences so the source stays readable without escaped backticks.
 */
const FENCE = "```";

function pmRunCommand(config: ProjectConfig, script: string): string {
  switch (config.packageManager) {
    case "npm":
      return `npm run ${script}`;
    case "bun":
      return `bun run ${script}`;
    case "yarn":
      return `yarn ${script}`;
    case "pnpm":
      return `pnpm ${script}`;
  }
}

function installCommand(config: ProjectConfig): string {
  switch (config.packageManager) {
    case "npm":
      return "npm install";
    case "bun":
      return "bun install";
    case "yarn":
      return "yarn";
    case "pnpm":
      return "pnpm install";
  }
}

function pmName(pm: PackageManager): string {
  const names: Record<PackageManager, string> = {
    pnpm: "pnpm",
    npm: "npm",
    yarn: "yarn",
    bun: "Bun",
  };
  return names[pm];
}

function frameworkTitle(config: ProjectConfig): string {
  switch (config.framework) {
    case "next":
      return "Next.js";
    case "vue":
      return "Vue + Vite";
    default:
      return "React + Vite";
  }
}

export function renderReadme(config: ProjectConfig): string {
  const dev = pmRunCommand(config, "dev");
  const build = pmRunCommand(config, "build");

  const stack: string[] = [frameworkTitle(config)];
  stack.push(config.language === "typescript" ? "TypeScript" : "JavaScript");
  switch (config.styling) {
    case "tailwind":
      stack.push("Tailwind CSS v4");
      break;
    case "css-modules":
      stack.push("CSS Modules");
      break;
    case "plain":
      stack.push("Plain CSS");
      break;
  }
  if (config.eslint) stack.push("ESLint (flat config)");
  if (config.prettier) stack.push("Prettier");

  const structure =
    config.framework === "next"
      ? "- `app/` — App Router pages and layout\n- `public/` — static assets"
      : "- `src/` — application source\n- `public/` — static assets";

  const lines: (string | null)[] = [
    `# ${config.projectName}`,
    "",
    `A [${frameworkTitle(config)}](https://${
      config.framework === "next" ? "nextjs.org" : "vite.dev"
    }) project generated with [frontend-starter](https://github.com/mohammadhossein-asadi/frontend-starter-cli).`,
    "",
    "## Stack",
    "",
    ...stack.map((item) => `- ${item}`),
    "",
    "## Getting started",
    "",
    FENCE,
    `# install dependencies (${pmName(config.packageManager)})`,
    installCommand(config),
    "",
    "# start the dev server",
    dev,
    FENCE,
    "",
    "## Scripts",
    "",
    `| Script | Command |`,
    `| --- | --- |`,
    `| Dev server | \`${dev}\` |`,
    `| Production build | \`${build}\` |`,
    config.eslint ? `| Lint | \`${pmRunCommand(config, "lint")}\` |` : null,
    config.prettier ? `| Format | \`${pmRunCommand(config, "format")}\` |` : null,
    "",
    "## Project structure",
    "",
    structure,
    "",
    "---",
    "",
    "_Generated with frontend-starter. Edit freely — this is your project now._",
    "",
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}
