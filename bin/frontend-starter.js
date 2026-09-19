#!/usr/bin/env node
// Cross-platform launcher for the frontend-starter CLI.
// Kept as a tiny shim so the compiled bundle lives in dist/ and the
// package `files` whitelist stays minimal.
import { main } from "../dist/index.js";

main().catch((error) => {
  process.exitCode = 1;
  console.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
});
