import { EXIT_CODES } from "../types.js";

/** Options carried by every StarterError for consistent reporting. */
export interface ErrorOptions {
  /** One-line remediation shown to the user, if any. */
  hint?: string;
  /** Suggested CLI invocation that avoids the failure. */
  suggestion?: string;
  /** Underlying cause, preserved for `--verbose` output. */
  cause?: unknown;
}

/** Base class for all expected, human-readable CLI failures. */
export class StarterError extends Error {
  readonly hint?: string;
  readonly suggestion?: string;
  /** Exit code associated with this failure class. */
  readonly exitCode: number;

  constructor(
    message: string,
    options: ErrorOptions = {},
    exitCode: number = EXIT_CODES.generationFailed,
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "StarterError";
    this.hint = options.hint;
    this.suggestion = options.suggestion;
    this.exitCode = exitCode;
  }
}

/** Input validation failed (bad project name, bad flags, bad config file). */
export class ValidationError extends StarterError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = "ValidationError";
  }
}

/** Environment problem: missing Node version, missing package manager, no git… */
export class EnvironmentError extends StarterError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = "EnvironmentError";
  }
}

/** The generation target cannot be used (exists, parent missing, unsafe path…). */
export class TargetDirectoryError extends StarterError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = "TargetDirectoryError";
  }
}

/** A post-generation task failed; files exist and the project is usable. */
export class PostTaskError extends StarterError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, { ...options }, EXIT_CODES.postTaskFailed);
    this.name = "PostTaskError";
  }
}

/** Normalize an unknown thrown value into an Error. */
export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(typeof value === "string" ? value : JSON.stringify(value));
}
