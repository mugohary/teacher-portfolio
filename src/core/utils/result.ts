/**
 * Lightweight Result (Either) type — explicit error handling without exceptions.
 * Used at every trust boundary: env loading, DTO parsing, strategy validation.
 */

export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

export type Result<T, E = Error> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}

/** Unwrap a result, throwing on failure. Intentional at app boundaries only. */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) return result.value;
  const message =
    result.error instanceof Error ? result.error.message : String(result.error);
  throw new Error(`unwrap() on Err: ${message}`);
}

/** Map the success value while preserving the error channel. */
export function mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}
