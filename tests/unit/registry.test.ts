import { describe, expect, it } from "vitest";
import type { ProjectConfig } from "../../src/types.js";
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
    for (const framework of ["react", "next", "vue"] as const) {
      for (const language of ["typescript", "javascript"] as const) {
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
});
