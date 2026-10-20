import type { Middleware } from './types';
import type { ValidationIssue } from '../errors/AppError';

type FieldOf<T> = Extract<keyof T, string>;

function pushIssue<T>(ctx: { issues: ValidationIssue[] }, field: string, rule: string, message: string): void {
  ctx.issues.push({ field, rule, message });
}

const asTrimmedString = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value).trim();

/** Coerce every string field to its trimmed form. Always continues the chain. */
export const trimAllFields =
  <T extends Record<string, unknown>>(): Middleware<T> =>
  (ctx, next) => {
    for (const key of Object.keys(ctx.input) as FieldOf<T>[]) {
      const value = ctx.input[key];
      if (typeof value === 'string') {
        (ctx.input as Record<string, unknown>)[key] = value.trim();
      }
    }
    next();
  };

/** Reject empty / missing values. */
export const required =
  <T extends Record<string, unknown>>(field: FieldOf<T>, rule = 'required'): Middleware<T> =>
  (ctx, next) => {
    if (asTrimmedString(ctx.input[field]) === '') {
      pushIssue(ctx, field, rule, `${field} is required.`);
      return;
    }
    next();
  };

export const minLength =
  <T extends Record<string, unknown>>(field: FieldOf<T>, min: number): Middleware<T> =>
  (ctx, next) => {
    const value = asTrimmedString(ctx.input[field]);
    if (value !== '' && value.length < min) {
      pushIssue(ctx, field, 'minLength', `${field} must be at least ${min} characters.`);
      return;
    }
    next();
  };

export const maxLength =
  <T extends Record<string, unknown>>(field: FieldOf<T>, max: number): Middleware<T> =>
  (ctx, next) => {
    const value = asTrimmedString(ctx.input[field]);
    if (value.length > max) {
      pushIssue(ctx, field, 'maxLength', `${field} must be at most ${max} characters.`);
      return;
    }
    next();
  };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail =
  <T extends Record<string, unknown>>(field: FieldOf<T>): Middleware<T> =>
  (ctx, next) => {
    const value = asTrimmedString(ctx.input[field]);
    if (value !== '' && !EMAIL_PATTERN.test(value)) {
      pushIssue(ctx, field, 'email', `${field} must be a valid email address.`);
      return;
    }
    next();
  };

/** Reject values containing HTML/script payloads at the trust boundary. */
export const noHtml =
  <T extends Record<string, unknown>>(...fields: FieldOf<T>[]): Middleware<T> =>
  (ctx, next) => {
    const dangerous = /[<>]|javascript:/i;
    for (const field of fields) {
      if (dangerous.test(asTrimmedString(ctx.input[field]))) {
        pushIssue(ctx, field, 'noHtml', `${field} must not contain HTML.`);
        return;
      }
    }
    next();
  };

export const matches =
  <T extends Record<string, unknown>>(field: FieldOf<T>, pattern: RegExp, rule = 'pattern'): Middleware<T> =>
  (ctx, next) => {
    const value = asTrimmedString(ctx.input[field]);
    if (value !== '' && !pattern.test(value)) {
      pushIssue(ctx, field, rule, `${field} does not match the expected format.`);
      return;
    }
    next();
  };
