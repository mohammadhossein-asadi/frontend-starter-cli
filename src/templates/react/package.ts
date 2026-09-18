import type { Json } from "../merge.js";
import type { Language } from "../../types.js";

/**
 * package.json fragments for framework bases and overlays. Versions verified
 * against the npm registry (Sept 2026); caret ranges keep projects installable
 * as patches land.
 */

const NODE_ENGINES = { node: ">=20.19.0" };

/** package.json fragment for the React (Vite) base, per language. */
export function reactBasePackage(language: Language, projectName: string): Json {
  const scripts: Record<string, Json> = {
    dev: "vite",
    build: language === "typescript" ? "tsc -b && vite build" : "vite build",
    preview: "vite preview",
  };
  const dependencies: Record<string, Json> = {
    react: "^19.3.0",
    "react-dom": "^19.3.0",
  };
  const devDependencies: Record<string, Json> = {
    "@vitejs/plugin-react": "^6.1.1",
    vite: "^8.3.0",
  };
  if (language === "typescript") {
    devDependencies["typescript"] = "~5.9.3";
    devDependencies["@types/react"] = "^19.3.0";
    devDependencies["@types/react-dom"] = "^19.3.0";
  }
  return {
    name: projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    engines: NODE_ENGINES,
    scripts,
    dependencies,
    devDependencies,
  };
}

/** package.json fragment for the Next.js (App Router) base, per language. */
export function nextBasePackage(language: Language, projectName: string): Json {
  const scripts: Record<string, Json> = {
    dev: "next dev",
    build: "next build",
    start: "next start",
  };
  const dependencies: Record<string, Json> = {
    next: "^16.3.5",
    react: "^19.3.0",
    "react-dom": "^19.3.0",
  };
  const devDependencies: Record<string, Json> = {};
  if (language === "typescript") {
    devDependencies["typescript"] = "~5.9.3";
    devDependencies["@types/node"] = "^20.19.0";
    devDependencies["@types/react"] = "^19.3.0";
    devDependencies["@types/react-dom"] = "^19.3.0";
  }
  return {
    name: projectName,
    private: true,
    version: "0.0.0",
    engines: NODE_ENGINES,
    scripts,
    dependencies,
    devDependencies,
  };
}

/** package.json fragment for the Vue (Vite) base, per language. */
export function vueBasePackage(language: Language, projectName: string): Json {
  const scripts: Record<string, Json> = {
    dev: "vite",
    build: language === "typescript" ? "vue-tsc -b && vite build" : "vite build",
    preview: "vite preview",
  };
  const dependencies: Record<string, Json> = {
    vue: "^3.5.43",
  };
  const devDependencies: Record<string, Json> = {
    "@vitejs/plugin-vue": "^6.0.9",
    vite: "^8.3.0",
  };
  if (language === "typescript") {
    devDependencies["typescript"] = "~5.9.3";
    devDependencies["vue-tsc"] = "^3.3.11";
  }
  return {
    name: projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    engines: NODE_ENGINES,
    scripts,
    dependencies,
    devDependencies,
  };
}

/** Overlay fragment: Tailwind CSS v4, per framework. */
export function tailwindPackage(framework: "react" | "next" | "vue"): Json {
  const devDependencies: Record<string, Json> = { tailwindcss: "^4.3.3" };
  if (framework === "next") {
    devDependencies["@tailwindcss/postcss"] = "^4.3.3";
  } else {
    // react and vue both consume Tailwind through the Vite plugin.
    devDependencies["@tailwindcss/vite"] = "^4.3.3";
  }
  return { devDependencies };
}

/** Overlay fragment: CSS Modules needs nothing beyond the framework base. */
export function cssModulesPackage(): Json {
  return {};
}

/** Overlay fragment: ESLint flat setup, per framework. */
export function eslintPackage(framework: "react" | "next" | "vue"): Json {
  const devDependencies: Record<string, Json> = {
    eslint: "^9.39.5",
    globals: "^17.12.0",
  };
  if (framework === "react") {
    devDependencies["@eslint/js"] = "^9.39.5";
    devDependencies["eslint-plugin-react-hooks"] = "^7.1.1";
    devDependencies["typescript-eslint"] = "^8.70.0";
  } else if (framework === "next") {
    devDependencies["eslint-config-next"] = "^16.3.5";
    devDependencies["@eslint/eslintrc"] = "^3.3.7";
  } else {
    devDependencies["eslint-plugin-vue"] = "^10.11.0";
    devDependencies["@eslint/js"] = "^9.39.5";
    devDependencies["typescript-eslint"] = "^8.70.0";
  }
  const scripts: Record<string, Json> = { lint: "eslint ." };
  return { scripts, devDependencies };
}

/** Overlay fragment: Prettier. */
export function prettierPackage(): Json {
  return {
    scripts: {
      format: "prettier --write .",
      "format:check": "prettier --check .",
    },
    devDependencies: { prettier: "^3.9.8" },
  };
}
