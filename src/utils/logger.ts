import pc from "picocolors";

/**
 * Central output layer. Respects --quiet / --verbose and degrades gracefully
 * when colors are unavailable (pipe, NO_COLOR, dumb terminal) — picocolors
 * handles the detection, we only centralize usage.
 */
class Logger {
  private quiet = false;
  private verbose = false;
  /** Set while a spinner owns the line so logs interleave correctly. */
  private spinning = false;

  configure(options: { quiet?: boolean; verbose?: boolean } = {}): void {
    if (options.quiet !== undefined) this.quiet = options.quiet;
    if (options.verbose !== undefined) this.verbose = options.verbose;
  }

  /** Called by the spinner helper so plain logs can break the spinner line. */
  setSpinning(spinning: boolean): void {
    this.spinning = spinning;
  }

  isQuiet(): boolean {
    return this.quiet;
  }

  isVerbose(): boolean {
    return this.verbose;
  }

  info(message: string): void {
    if (!this.quiet) console.log(message);
  }

  step(message: string): void {
    if (!this.quiet) console.log(pc.bold(message));
  }

  success(message: string): void {
    if (!this.quiet) console.log(`${pc.green("✔")} ${message}`);
  }

  warn(message: string): void {
    if (!this.quiet) console.warn(`${pc.yellow("⚠")} ${message}`);
  }

  fail(message: string): void {
    if (!this.quiet) console.error(`${pc.red("✖")} ${message}`);
  }

  detail(message: string): void {
    if (this.verbose && !this.spinning) console.log(pc.dim(message));
  }

  /** Plain report line (no icon); suppressed in quiet mode. */
  print(message: string): void {
    if (!this.quiet) console.log(message);
  }

  /** Always printed, even in quiet mode (final result summaries). */
  final(message: string): void {
    console.log(message);
  }
}

export const logger = new Logger();
