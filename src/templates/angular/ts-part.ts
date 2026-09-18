import type { TemplatePart } from "../../types.js";

/**
 * Angular 20 source files (TypeScript-only framework). Ships stable zoneless
 * change detection (`provideZonelessChangeDetection()`), so there is no
 * polyfill or zone.js dependency to maintain. `angular.json` uses the modern
 * @angular/build application builder.
 */

const ANGULAR_JSON = {
  $schema: "./node_modules/@angular/cli/lib/config/schema.json",
  version: 1,
  newProjectRoot: "projects",
  projects: {
    app: {
      projectType: "application",
      root: "",
      sourceRoot: "src",
      prefix: "app",
      architect: {
        build: {
          builder: "@angular/build:application",
          options: {
            outputPath: "dist/app",
            index: "src/index.html",
            browser: "src/main.ts",
            polyfills: [],
            tsConfig: "tsconfig.json",
            assets: [],
            styles: ["src/styles.css"],
            scripts: [],
            prerender: false,
            ssr: false,
          },
          configurations: {
            production: {
              budgets: [
                { type: "initial", maximumWarning: "500kB", maximumError: "1MB" },
                { type: "anyComponentStyle", maximumWarning: "4kB", maximumError: "8kB" },
              ],
              outputHashing: "all",
            },
            development: {
              optimization: false,
              extractLicenses: false,
              sourceMap: true,
            },
          },
          defaultConfiguration: "production",
        },
        serve: {
          builder: "@angular/build:dev-server",
          configurations: {
            production: { buildTarget: "app:build:production" },
            development: { buildTarget: "app:build:development" },
          },
          defaultConfiguration: "development",
        },
      },
    },
  },
};

const TSCONFIG = JSON.stringify(
  {
    compileOnSave: false,
    compilerOptions: {
      strict: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
      isolatedModules: true,
      esModuleInterop: true,
      experimentalDecorators: false,
      importHelpers: true,
      target: "ES2022",
      module: "preserve",
    },
    angularCompilerOptions: {
      enableI18nLegacyMessageIdFormat: false,
      strictInjectionParameters: true,
      strictTemplates: true,
      typeCheckHostBindings: true,
    },
    files: ["src/main.ts"],
    include: ["src/**/*.d.ts"],
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
  "    <title>frontend-starter · angular</title>",
  "  </head>",
  "  <body>",
  "    <app-root></app-root>",
  "  </body>",
  "</html>",
  "",
].join("\n");

const MAIN_TS = [
  'import { bootstrapApplication } from "@angular/platform-browser";',
  "",
  'import { appConfig } from "./app/app.config";',
  'import { App } from "./app/app";',
  "",
  "bootstrapApplication(App, appConfig).catch((err) => console.error(err));",
  "",
].join("\n");

const APP_CONFIG_TS = [
  "import {",
  "  ApplicationConfig,",
  "  provideBrowserGlobalErrorListeners,",
  "  provideZonelessChangeDetection,",
  '} from "@angular/core";',
  "",
  "export const appConfig: ApplicationConfig = {",
  "  providers: [provideBrowserGlobalErrorListeners(), provideZonelessChangeDetection()],",
  "};",
  "",
].join("\n");

const APP_TS = [
  'import { Component, signal } from "@angular/core";',
  "",
  "@Component({",
  '  selector: "app-root",',
  '  templateUrl: "./app.html",',
  "  styles: ``,",
  "})",
  "export class App {",
  "  protected readonly count = signal(0);",
  "}",
  "",
].join("\n");

const APP_HTML = [
  '<main class="app">',
  "  <h1>Angular + TypeScript</h1>",
  "  <p>",
  "    Edit <code>src/app/app.html</code> and save to test HMR.",
  "  </p>",
  '  <button type="button" (click)="count.set(count() + 1)">',
  "    count is {{ count() }}",
  "  </button>",
  "</main>",
  "",
].join("\n");

export function angularTsPart(): TemplatePart {
  return {
    id: "angular/_ts",
    files: {
      "angular.json": JSON.stringify(ANGULAR_JSON, null, 2) + "\n",
      "tsconfig.json": TSCONFIG,
      "src/index.html": INDEX_HTML,
      "src/main.ts": MAIN_TS,
      "src/app/app.config.ts": APP_CONFIG_TS,
      "src/app/app.ts": APP_TS,
      "src/app/app.html": APP_HTML,
    },
  };
}
