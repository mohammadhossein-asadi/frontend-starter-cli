import { describe, expect, it } from "vitest";
import { allowedLanguages, type ProjectConfig } from "../../src/types.js";
import { resolveTemplate } from "../../src/templates/registry.js";

/** Build a full config, overriding only what a test cares about. */
function baseConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: "test-app",
    framework: "react",
    language: "typescript",
    styling: "tailwind",
    packageManager: "pnpm",
    eslint: true,
    prettier: true,
    git: true,
    install: true,
    force: false,
    ...overrides,
  };
}

describe("resolveTemplate", () => {
  it("produces the core files for every framework × language combo", () => {
    for (const framework of [
      "react",
      "next",
      "vue",
      "svelte",
      "solid",
      "qwik",
      "astro",
      "angular",
    ] as const) {
      for (const language of allowedLanguages(framework)) {
        const resolved = resolveTemplate(baseConfig({ framework, language }));
        expect(
          resolved.files["package.json"],
          `${framework}/${language} package.json`,
        ).toBeTruthy();
        expect(resolved.files[".gitignore"], `${framework}/${language} gitignore`).toBeTruthy();
        expect(resolved.files["README.md"], `${framework}/${language} readme`).toBeTruthy();
      }
    }
  });

  it("places react apps under src/ and next apps under app/", () => {
    const react = resolveTemplate(baseConfig({ framework: "react", styling: "plain" }));
    expect(Object.keys(react.files)).toContain("src/main.tsx");
    expect(Object.keys(react.files)).toContain("index.html");

    const next = resolveTemplate(baseConfig({ framework: "next", styling: "plain" }));
    expect(Object.keys(next.files)).toContain("app/layout.tsx");
    expect(Object.keys(next.files)).toContain("next.config.ts");
  });

  it("javascript slices never emit tsconfig or .tsx files", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "react", language: "javascript" }));
    for (const filePath of Object.keys(resolved.files)) {
      expect(filePath.endsWith(".ts") || filePath.endsWith(".tsx")).toBe(false);
    }
    expect(resolved.files["package.json"]).not.toContain('"typescript"');
  });

  it("typescript slices include typescript tooling", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "react", language: "typescript" }));
    expect(resolved.files["tsconfig.json"]).toBeTruthy();
    const pkg = JSON.parse(resolved.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies["typescript"]).toBeTruthy();
    expect(pkg.devDependencies["@vitejs/plugin-react"]).toBeTruthy();
  });

  it("tailwind overlay adds tailwind deps and the right stylesheet per framework", () => {
    const react = resolveTemplate(baseConfig({ framework: "react", styling: "tailwind" }));
    expect(react.files["src/styles.css"]).toContain('@import "tailwindcss"');
    const reactPkg = JSON.parse(react.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(reactPkg.devDependencies["@tailwindcss/vite"]).toBeTruthy();

    const next = resolveTemplate(baseConfig({ framework: "next", styling: "tailwind" }));
    expect(next.files["app/globals.css"]).toContain('@import "tailwindcss"');
    const nextPkg = JSON.parse(next.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(nextPkg.devDependencies["@tailwindcss/postcss"]).toBeTruthy();
    expect(nextPkg.devDependencies["@tailwindcss/vite"]).toBeUndefined();
  });

  it("plain CSS and CSS Modules do not leak tailwind dependencies", () => {
    for (const styling of ["plain", "css-modules"] as const) {
      const resolved = resolveTemplate(baseConfig({ styling }));
      const pkg = JSON.parse(resolved.files["package.json"] as string) as {
        devDependencies: Record<string, string>;
      };
      expect(pkg.devDependencies["tailwindcss"]).toBeUndefined();
    }
  });

  it("css-modules overlay swaps the component to use the module", () => {
    const react = resolveTemplate(baseConfig({ framework: "react", styling: "css-modules" }));
    expect(react.files["src/App.module.css"]).toBeTruthy();
    expect(react.files["src/App.tsx"]).toContain('import styles from "./App.module.css"');

    const nextJs = resolveTemplate(
      baseConfig({ framework: "next", language: "javascript", styling: "css-modules" }),
    );
    expect(nextJs.files["app/page.module.css"]).toBeTruthy();
    expect(nextJs.files["app/page.jsx"]).toContain("./page.module.css");
  });

  it("eslint overlay emits a flat config and lint script only when enabled", () => {
    const withEslint = resolveTemplate(baseConfig({ eslint: true }));
    expect(withEslint.files["eslint.config.mjs"]).toBeTruthy();
    const pkg = JSON.parse(withEslint.files["package.json"] as string) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.scripts["lint"]).toBeTruthy();
    expect(pkg.devDependencies["eslint"]).toBeTruthy();

    const without = resolveTemplate(baseConfig({ eslint: false }));
    expect(without.files["eslint.config.mjs"]).toBeUndefined();
    const pkg2 = JSON.parse(without.files["package.json"] as string) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg2.scripts["lint"]).toBeUndefined();
    expect(pkg2.devDependencies["eslint"]).toBeUndefined();
  });

  it("next eslint config uses FlatCompat while react does not", () => {
    const next = resolveTemplate(baseConfig({ framework: "next", eslint: true }));
    expect(next.files["eslint.config.mjs"]).toContain("FlatCompat");

    const react = resolveTemplate(baseConfig({ framework: "react", eslint: true }));
    expect(react.files["eslint.config.mjs"]).not.toContain("FlatCompat");
  });

  it("prettier overlay adds config files and scripts only when enabled", () => {
    const withPrettier = resolveTemplate(baseConfig({ prettier: true }));
    expect(withPrettier.files[".prettierrc.json"]).toBeTruthy();
    expect(withPrettier.files[".prettierignore"]).toContain("node_modules/");

    const without = resolveTemplate(baseConfig({ prettier: false }));
    expect(without.files[".prettierrc.json"]).toBeUndefined();
  });

  it("package.json name and scripts reflect the config", () => {
    const resolved = resolveTemplate(
      baseConfig({ projectName: "my-app", framework: "next", prettier: true }),
    );
    const pkg = JSON.parse(resolved.files["package.json"] as string) as {
      name: string;
      scripts: Record<string, string>;
    };
    expect(pkg.name).toBe("my-app");
    expect(pkg.scripts["dev"]).toBe("next dev");
    expect(pkg.scripts["format"]).toBeTruthy();
  });

  it("records the parts used to build the project", () => {
    const resolved = resolveTemplate(baseConfig());
    expect(resolved.parts[0]).toBe("react/_ts");
    expect(resolved.parts).toContain("overlays/styling/tailwind");
    expect(resolved.parts).toContain("overlays/eslint");
    expect(resolved.parts[resolved.parts.length - 1]).toBe("shared");
  });

  it("react entry point imports the App component (regression)", () => {
    for (const language of ["typescript", "javascript"] as const) {
      const ext = language === "typescript" ? "tsx" : "jsx";
      const resolved = resolveTemplate(
        baseConfig({ framework: "react", language, styling: "plain" }),
      );
      const main = resolved.files[`src/main.${ext}`];
      expect(main, `src/main.${ext} exists`).toBeTruthy();
      expect(main).toContain('import App from "./App.' + ext + '"');
    }
  });

  it("vue projects emit SFC sources and the vite vue plugin", () => {
    const ts = resolveTemplate(
      baseConfig({ framework: "vue", language: "typescript", styling: "plain" }),
    );
    expect(ts.files["src/App.vue"]).toBeTruthy();
    expect(ts.files["src/main.ts"]).toContain('import App from "./App.vue"');
    expect(ts.files["vite.config.ts"]).toContain("@vitejs/plugin-vue");
    const pkg = JSON.parse(ts.files["package.json"] as string) as {
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.scripts["build"]).toContain("vue-tsc");
    expect(pkg.dependencies["vue"]).toBeTruthy();
    expect(pkg.devDependencies["vue-tsc"]).toBeTruthy();

    const js = resolveTemplate(
      baseConfig({ framework: "vue", language: "javascript", styling: "plain" }),
    );
    expect(js.files["vite.config.js"]).toBeTruthy();
    expect(js.files["src/main.js"]).toBeTruthy();
    const jsPkg = JSON.parse(js.files["package.json"] as string) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(jsPkg.scripts["build"]).toBe("vite build");
    expect(jsPkg.devDependencies["vue-tsc"]).toBeUndefined();
  });

  it("vue eslint config uses eslint-plugin-vue flat config", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "vue", eslint: true }));
    expect(resolved.files["eslint.config.mjs"]).toContain("eslint-plugin-vue");
    expect(resolved.files["eslint.config.mjs"]).toContain("flat/recommended");
  });

  it("vue css-modules overlay is an SFC style module, not a separate file", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "vue", styling: "css-modules" }));
    expect(resolved.files["src/App.vue"]).toContain("<style module>");
    expect(resolved.files["src/App.vue"]).toContain("$style.app");
    expect(resolved.files["src/App.module.css"]).toBeUndefined();
  });

  it("tailwind overlay emits framework wiring for every vite-based framework", () => {
    for (const framework of ["react", "vue"] as const) {
      for (const language of ["typescript", "javascript"] as const) {
        const ext = language === "typescript" ? "ts" : "js";
        const resolved = resolveTemplate(baseConfig({ framework, language, styling: "tailwind" }));
        expect(resolved.files[`vite.config.${ext}`], `${framework}/${ext}`).toContain(
          "@tailwindcss/vite",
        );
      }
    }
    const next = resolveTemplate(baseConfig({ framework: "next", styling: "tailwind" }));
    expect(next.files["postcss.config.mjs"]).toContain("@tailwindcss/postcss");
  });

  it("tailwind overlay wiring is absent without the tailwind styling", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "react", styling: "plain" }));
    expect(resolved.files["vite.config.ts"]).not.toContain("tailwind");
    expect(resolved.files["postcss.config.mjs"]).toBeUndefined();
  });

  it("gitignore blocks node_modules for both frameworks and next build output", () => {
    const react = resolveTemplate(baseConfig({ framework: "react" }));
    expect(react.files[".gitignore"]).toContain("node_modules/");
    const next = resolveTemplate(baseConfig({ framework: "next" }));
    expect(next.files[".gitignore"]).toContain(".next/");
  });

  // ---- 8-framework expansion -------------------------------------------

  it("svelte projects emit Svelte 5 sources, the vite plugin and svelte-check", () => {
    const ts = resolveTemplate(
      baseConfig({ framework: "svelte", language: "typescript", styling: "plain" }),
    );
    expect(ts.files["src/App.svelte"]).toContain("$state(0)");
    expect(ts.files["src/main.ts"]).toContain('import { mount } from "svelte"');
    expect(ts.files["svelte.config.js"]).toBeTruthy();
    expect(ts.files["vite.config.ts"]).toContain("@sveltejs/vite-plugin-svelte");
    const pkg = JSON.parse(ts.files["package.json"] as string) as {
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.scripts["build"]).toContain("svelte-check");
    expect(pkg.devDependencies["svelte"]).toBeTruthy();
    expect(pkg.devDependencies["@sveltejs/vite-plugin-svelte"]).toBeTruthy();
    expect(pkg.devDependencies["svelte-check"]).toBeTruthy();

    const js = resolveTemplate(
      baseConfig({ framework: "svelte", language: "javascript", styling: "plain" }),
    );
    const jsPkg = JSON.parse(js.files["package.json"] as string) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(jsPkg.scripts["build"]).toBe("vite build");
    expect(jsPkg.devDependencies["svelte-check"]).toBeUndefined();
  });

  it("solid projects emit solid-js sources and the vite solid plugin", () => {
    const ts = resolveTemplate(
      baseConfig({ framework: "solid", language: "typescript", styling: "plain" }),
    );
    expect(ts.files["src/index.tsx"]).toContain('import { render } from "solid-js/web"');
    expect(ts.files["src/App.tsx"]).toContain("createSignal");
    expect(ts.files["vite.config.ts"]).toContain("vite-plugin-solid");
    const pkg = JSON.parse(ts.files["package.json"] as string) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.dependencies["solid-js"]).toBeTruthy();
    expect(pkg.devDependencies["vite-plugin-solid"]).toBeTruthy();
    expect(pkg.devDependencies["typescript"]).toBeTruthy();

    const js = resolveTemplate(
      baseConfig({ framework: "solid", language: "javascript", styling: "plain" }),
    );
    expect(js.files["src/index.jsx"]).toBeTruthy();
    const jsPkg = JSON.parse(js.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(jsPkg.devDependencies["typescript"]).toBeUndefined();
  });

  it("qwik projects emit qwik city routes and pin vite to ^7 (peer range)", () => {
    const ts = resolveTemplate(
      baseConfig({ framework: "qwik", language: "typescript", styling: "plain" }),
    );
    expect(ts.files["src/root.tsx"]).toContain("QwikCityProvider");
    expect(ts.files["src/routes/index.tsx"]).toBeTruthy();
    expect(ts.files["src/entry.ssr.tsx"]).toBeTruthy();
    expect(ts.files["vite.config.ts"]).toContain("qwikCity");
    const pkg = JSON.parse(ts.files["package.json"] as string) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies["@builder.io/qwik"]).toBeTruthy();
    expect(pkg.devDependencies["@builder.io/qwik-city"]).toBeTruthy();
    expect(pkg.devDependencies["vite"]).toBe("^7.3.6");

    const js = resolveTemplate(
      baseConfig({ framework: "qwik", language: "javascript", styling: "plain" }),
    );
    expect(js.files["src/root.jsx"]).toBeTruthy();
    expect(js.files["src/routes/index.jsx"]).toBeTruthy();
  });

  it("astro projects emit astro pages and pin astro to ^5 (node 20 floor)", () => {
    for (const language of ["typescript", "javascript"] as const) {
      const resolved = resolveTemplate(
        baseConfig({ framework: "astro", language, styling: "plain" }),
      );
      expect(resolved.files["astro.config.mjs"]).toBeTruthy();
      expect(resolved.files["src/pages/index.astro"]).toBeTruthy();
      expect(resolved.files["src/layouts/Layout.astro"]).toBeTruthy();
      const pkg = JSON.parse(resolved.files["package.json"] as string) as {
        dependencies: Record<string, string>;
      };
      expect(pkg.dependencies["astro"]).toBe("^5.18.2");
    }
  });

  it("angular projects emit zoneless sources, angular.json and pin core@^20", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "angular", styling: "plain" }));
    expect(resolved.files["angular.json"]).toBeTruthy();
    expect(resolved.files["src/main.ts"]).toContain("bootstrapApplication");
    expect(resolved.files["src/app/app.config.ts"]).toContain("provideZonelessChangeDetection");
    expect(resolved.files["src/app/app.ts"]).toContain("signal(0)");
    const pkg = JSON.parse(resolved.files["package.json"] as string) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.dependencies["@angular/core"]).toBe("^20.3.31");
    expect(pkg.devDependencies["@angular/build"]).toBe("^20.3.37");
    expect(pkg.devDependencies["zone.js"]).toBeUndefined();
  });

  it("angular eslint config uses angular-eslint with template checking", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "angular", eslint: true }));
    expect(resolved.files["eslint.config.mjs"]).toContain("angular-eslint");
    expect(resolved.files["eslint.config.mjs"]).toContain("templateRecommended");
    const pkg = JSON.parse(resolved.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies["angular-eslint"]).toBeTruthy();
  });

  it("tailwind overlay emits framework wiring for every vite-based framework", () => {
    for (const framework of ["react", "vue", "svelte", "solid"] as const) {
      for (const language of ["typescript", "javascript"] as const) {
        const ext = language === "typescript" ? "ts" : "js";
        const resolved = resolveTemplate(baseConfig({ framework, language, styling: "tailwind" }));
        expect(resolved.files[`vite.config.${ext}`], `${framework}/${ext}`).toContain(
          "@tailwindcss/vite",
        );
      }
    }
    const qwik = resolveTemplate(baseConfig({ framework: "qwik", styling: "tailwind" }));
    expect(qwik.files["vite.config.ts"]).toContain("@tailwindcss/vite");

    const astro = resolveTemplate(baseConfig({ framework: "astro", styling: "tailwind" }));
    expect(astro.files["astro.config.mjs"]).toContain("@tailwindcss/vite");
    expect(astro.files["astro.config.mjs"]).toContain("tailwindcss()");

    const next = resolveTemplate(baseConfig({ framework: "next", styling: "tailwind" }));
    expect(next.files["postcss.config.mjs"]).toContain("@tailwindcss/postcss");

    const angular = resolveTemplate(baseConfig({ framework: "angular", styling: "tailwind" }));
    expect(angular.files[".postcssrc.json"]).toContain("@tailwindcss/postcss");
    const angularPkg = JSON.parse(angular.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(angularPkg.devDependencies["@tailwindcss/postcss"]).toBeTruthy();
    expect(angularPkg.devDependencies["@tailwindcss/vite"]).toBeUndefined();
  });

  it("astro tailwind config keeps the docs comment and plugin wiring", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "astro", styling: "tailwind" }));
    expect(resolved.files["astro.config.mjs"]).toContain("astro.build/config");
    expect(resolved.files["astro.config.mjs"]).toContain("tailwindcss()");
  });

  it("svelte prettier overlay includes the svelte plugin", () => {
    const resolved = resolveTemplate(
      baseConfig({ framework: "svelte", language: "typescript", prettier: true }),
    );
    expect(resolved.files[".prettierrc.json"]).toContain("prettier-plugin-svelte");
    const pkg = JSON.parse(resolved.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies["prettier-plugin-svelte"]).toBeTruthy();
  });

  it("astro prettier overlay includes the astro plugin", () => {
    const resolved = resolveTemplate(baseConfig({ framework: "astro", prettier: true }));
    expect(resolved.files[".prettierrc.json"]).toContain("prettier-plugin-astro");
    const pkg = JSON.parse(resolved.files["package.json"] as string) as {
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies["prettier-plugin-astro"]).toBeTruthy();
  });

  it("gitignore covers angular and astro build caches", () => {
    const angular = resolveTemplate(baseConfig({ framework: "angular" }));
    expect(angular.files[".gitignore"]).toContain(".angular/");
    const astro = resolveTemplate(baseConfig({ framework: "astro" }));
    expect(astro.files[".gitignore"]).toContain(".astro/");
  });
});
