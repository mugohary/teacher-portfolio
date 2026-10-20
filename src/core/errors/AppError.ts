import type { Result } from '../utils/result';
import { err, ok } from '../utils/result';

export type ErrorCode =
  | 'VALIDATION'
  | 'CONFIG'
  | 'NOT_FOUND'
  | 'NETWORK'
  | 'DOMAIN'
  | 'UNKNOWN';

/** Normalized error contract understood by the global error handler. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details: Record<string, unknown> | undefined;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }

  static from(error: unknown, fallback: ErrorCode = 'UNKNOWN'): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof Error) {
      return new AppError(fallback, error.message, undefined, { cause: error });
    }
    return new AppError(fallback, String(error));
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

/** A single field-level validation failure. */
export interface ValidationIssue {
  readonly field: string;
  /** Machine-readable rule id, mapped to localized copy in the UI. */
  readonly rule: string;
  /** Developer-facing fallback message. */
  readonly message: string;
}

/** Thrown/returned when DTO or form validation fails. */
export class ValidationError extends AppError {
  readonly issues: readonly ValidationIssue[];

  constructor(issues: readonly ValidationIssue[], message = 'Validation failed') {
    super('VALIDATION', message, { issues });
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export class ConfigError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFIG', message, details);
    this.name = 'ConfigError';
  }
}

/** Narrowing helpers for Result-typed validation outcomes. */
export type ValidationResult<T> = Result<T, ValidationError>;

export function validationFailure<T>(issues: readonly ValidationIssue[]): ValidationResult<T> {
  return err(new ValidationError(issues));
}

export function validationSuccess<T>(value: T): ValidationResult<T> {
  return ok(value);
}
