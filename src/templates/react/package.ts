import type { Json } from "../merge.js";
import type { Framework, Language } from "../../types.js";

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
export function tailwindPackage(framework: Framework): Json {
  const devDependencies: Record<string, Json> = { tailwindcss: "^4.3.3" };
  if (framework === "next" || framework === "angular") {
    // next: PostCSS pipeline via postcss.config.mjs; angular: its built-in
    // PostCSS pipeline via .postcssrc.json (see tailwind.angular.dev).
    devDependencies["@tailwindcss/postcss"] = "^4.3.3";
  } else {
    // react/vue/svelte/solid/qwik consume Tailwind through the Vite plugin.
    devDependencies["@tailwindcss/vite"] = "^4.3.3";
  }
  return { devDependencies };
}

/** Overlay fragment: CSS Modules needs nothing beyond the framework base. */
export function cssModulesPackage(): Json {
  return {};
}

/** Overlay fragment: ESLint flat setup, per framework. */
export function eslintPackage(framework: Framework): Json {
  const devDependencies: Record<string, Json> = {
    eslint: "^9.39.5",
    globals: "^17.12.0",
  };
  switch (framework) {
    case "react":
      devDependencies["@eslint/js"] = "^9.39.5";
      devDependencies["eslint-plugin-react-hooks"] = "^7.1.1";
      devDependencies["typescript-eslint"] = "^8.70.0";
      break;
    case "next":
      devDependencies["eslint-config-next"] = "^16.3.5";
      devDependencies["@eslint/eslintrc"] = "^3.3.7";
      break;
    case "vue":
      devDependencies["eslint-plugin-vue"] = "^10.11.0";
      devDependencies["@eslint/js"] = "^9.39.5";
      devDependencies["typescript-eslint"] = "^8.70.0";
      break;
    case "svelte":
      devDependencies["eslint-plugin-svelte"] = "^3.23.0";
      devDependencies["@eslint/js"] = "^9.39.5";
      devDependencies["typescript-eslint"] = "^8.70.0";
      break;
    case "solid":
      devDependencies["@eslint/js"] = "^9.39.5";
      devDependencies["typescript-eslint"] = "^8.70.0";
      break;
    case "qwik":
      devDependencies["eslint-plugin-qwik"] = "^1.20.0";
      devDependencies["@eslint/js"] = "^9.39.5";
      devDependencies["typescript-eslint"] = "^8.70.0";
      break;
    case "astro":
      // 2.x/3.x require ESLint >=10 and Node >=22 — above our floors.
      // 1.7.0 is the newest release supporting ESLint 9 + Node 20.
      devDependencies["eslint-plugin-astro"] = "^1.7.0";
      devDependencies["@eslint/js"] = "^9.39.5";
      devDependencies["typescript-eslint"] = "^8.70.0";
      break;
    case "angular":
      devDependencies["angular-eslint"] = "^20.7.0";
      devDependencies["typescript-eslint"] = "^8.70.0";
      break;
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

/** Overlay fragment: Prettier with framework plugins, per language. */
export function prettierPackageFor(framework: Framework, language: Language): Json {
  const base = prettierPackage() as {
    scripts: Record<string, Json>;
    devDependencies: Record<string, Json>;
  };
  if (framework === "svelte") {
    base.devDependencies["prettier-plugin-svelte"] = "^4.1.1";
    if (language === "typescript") base.devDependencies["svelte-check"] = "^4.7.6";
  }
  if (framework === "astro") {
    base.devDependencies["prettier-plugin-astro"] = "^1.0.1";
  }
  return base;
}

/** package.json fragment for the Svelte 5 (Vite) base, per language. */
export function svelteBasePackage(language: Language, projectName: string): Json {
  const scripts: Record<string, Json> = {
    dev: "vite",
    build:
      language === "typescript"
        ? "svelte-check --tsconfig ./tsconfig.json && vite build"
        : "vite build",
    preview: "vite preview",
    check: "svelte-check --tsconfig ./tsconfig.json",
  };
  const dependencies: Record<string, Json> = {};
  const devDependencies: Record<string, Json> = {
    "@sveltejs/vite-plugin-svelte": "^7.3.0",
    svelte: "^5.57.0",
    vite: "^8.3.0",
  };
  if (language === "typescript") {
    devDependencies["typescript"] = "~5.9.3";
    devDependencies["svelte-check"] = "^4.7.6";
    devDependencies["@tsconfig/svelte"] = "^5.0.8";
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

/** package.json fragment for the SolidJS (Vite) base, per language. */
export function solidBasePackage(language: Language, projectName: string): Json {
  const scripts: Record<string, Json> = {
    dev: "vite",
    build: language === "typescript" ? "tsc -b && vite build" : "vite build",
    preview: "vite preview",
  };
  const dependencies: Record<string, Json> = {
    "solid-js": "^1.9.15",
  };
  const devDependencies: Record<string, Json> = {
    "vite-plugin-solid": "^2.11.14",
    vite: "^8.3.0",
  };
  if (language === "typescript") {
    devDependencies["typescript"] = "~5.9.3";
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

/**
 * package.json fragment for the Qwik City base, per language. Qwik's vite
 * plugin peer range is `>=5 <8`, so vite is pinned to ^7 here — raising it
 * further is a deliberate migration, not a routine caret bump.
 */
export function qwikBasePackage(language: Language, projectName: string): Json {
  const scripts: Record<string, Json> = {
    dev: "vite --mode ssr",
    build: "qwik build",
    "build.client": "vite build",
    "build.preview": "vite build --ssr src/entry.preview.tsx",
    preview: "qwik build preview && vite preview --open",
  };
  const devDependencies: Record<string, Json> = {
    "@builder.io/qwik": "^1.20.0",
    "@builder.io/qwik-city": "^1.20.0",
    vite: "^7.3.6",
    "vite-tsconfig-paths": "^5.1.4",
  };
  if (language === "typescript") {
    devDependencies["typescript"] = "5.4.5";
  }
  return {
    name: projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    engines: NODE_ENGINES,
    scripts,
    devDependencies,
  };
}

/** package.json fragment for the Astro base, per language. */
export function astroBasePackage(language: Language, projectName: string): Json {
  const scripts: Record<string, Json> = {
    dev: "astro dev",
    build: "astro build",
    preview: "astro preview",
    astro: "astro",
  };
  const dependencies: Record<string, Json> = {
    astro: "^5.18.2",
  };
  const devDependencies: Record<string, Json> = {};
  if (language === "typescript") {
    devDependencies["typescript"] = "~5.9.3";
    devDependencies["@types/node"] = "^20.19.0";
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

/** package.json fragment for the Angular 20 base (TypeScript-only). */
export function angularBasePackage(projectName: string): Json {
  const scripts: Record<string, Json> = {
    ng: "ng",
    start: "ng serve",
    build: "ng build",
    watch: "ng build --watch --configuration development",
  };
  const dependencies: Record<string, Json> = {
    "@angular/common": "^20.3.31",
    "@angular/compiler": "^20.3.31",
    "@angular/core": "^20.3.31",
    "@angular/forms": "^20.3.31",
    "@angular/platform-browser": "^20.3.31",
    rxjs: "^7.8.2",
    tslib: "^2.8.1",
  };
  const devDependencies: Record<string, Json> = {
    "@angular/build": "^20.3.37",
    "@angular/cli": "^20.3.37",
    typescript: "~5.9.3",
  };
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
