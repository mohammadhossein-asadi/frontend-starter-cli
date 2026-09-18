import { Command } from "commander";
import pc from "picocolors";
import { runCreate } from "./commands/create.js";
import { runDoctor } from "./commands/doctor.js";
import { runInit } from "./commands/init.js";
import { runTemplates } from "./commands/templates.js";
import { declareCreateFlags, parseCreateFlags } from "./commands/create-flags.js";
import { PromptCancelled } from "./prompts/create-prompts.js";
import { StarterError, toError } from "./utils/errors.js";
import { logger } from "./utils/logger.js";
import { assertSupportedNode } from "./services/environment.js";
import { EXIT_CODES } from "./types.js";
import { cliVersion } from "./utils/version.js";

/**
 * CLI entry point. Wires commands and flags, normalizes exit codes, and
 * renders human-readable failures (with hints) instead of raw stack traces.
 */

/** Build the fully-wired CLI program. Exported for round-trip flag tests. */
export function buildCli(): Command {
  const program = new Command();

  program
    .name("frontend-starter")
    .description("Fast, cross-platform generator for modern frontend projects.")
    .version(cliVersion(), "-V, --version", "output the version number")
    .helpOption("-h, --help", "display help for command")
    .option("--verbose", "show detailed diagnostics", false)
    .option("--quiet", "suppress informational output", false)
    .option("--yes", "accept defaults and skip prompts (non-interactive)", false);

  type GlobalOpts = { verbose?: boolean; quiet?: boolean; yes?: boolean };

  function applyGlobalOptions(options: GlobalOpts): void {
    logger.configure({ verbose: options.verbose === true, quiet: options.quiet === true });
  }

  // Bare `frontend-starter` runs the default create flow. Flags are declared
  // and read from the single CREATE_FLAG_SPECS table (see create-flags.ts) —
  // the historic kebab/camelCase mismatch cannot recur.
  const createCommand = program
    .command("create", { isDefault: true })
    .description("create a new frontend project (interactive by default)")
    .argument("[name]", "project name (directory and npm package name)");

  declareCreateFlags(createCommand);

  createCommand.action(
    async (name: string | undefined, opts: Record<string, unknown> & GlobalOpts) => {
      const globalOpts = program.opts<GlobalOpts>();
      applyGlobalOptions({ ...globalOpts, ...opts });
      const code = await runCreate(name, parseCreateFlags(opts, globalOpts.yes === true));
      process.exitCode = code;
    },
  );

  program
    .command("doctor")
    .description("inspect the local development environment")
    .action(async () => {
      applyGlobalOptions(program.opts<GlobalOpts>());
      process.exitCode = await runDoctor();
    });

  program
    .command("init")
    .description("save personal defaults to the global config file")
    .action(async () => {
      applyGlobalOptions(program.opts<GlobalOpts>());
      process.exitCode = await runInit();
    });

  program
    .command("templates")
    .alias("list")
    .description("list supported frameworks, languages and styling options")
    .action(() => {
      applyGlobalOptions(program.opts<GlobalOpts>());
      process.exitCode = runTemplates();
    });

  return program;
}

/** Render a failure readably; return the process exit code to use. */
function handleCliError(error: unknown): number {
  const err = toError(error);
  if (err instanceof PromptCancelled) {
    logger.final(pc.dim("Cancelled."));
    return EXIT_CODES.cancelled;
  }
  if (err instanceof StarterError) {
    logger.fail(err.message);
    if (err.hint) logger.final(pc.yellow(`  ${err.hint}`));
    if (err.suggestion) logger.final(pc.dim(`  Try: ${err.suggestion}`));
    if (logger.isVerbose() && err.cause instanceof Error) {
      logger.final(pc.dim(err.cause.message));
    }
    return err.exitCode;
  }
  logger.fail(`Unexpected error: ${err.message}`);
  if (logger.isVerbose()) logger.final(pc.dim(err.stack ?? ""));
  return EXIT_CODES.generationFailed;
}

export async function main(): Promise<void> {
  const program = buildCli();
  try {
    // Enforce the Node floor before anything else parses or imports further.
    assertSupportedNode();
    await program.parseAsync();
  } catch (error) {
    process.exitCode = handleCliError(error);
  }
}
