import type { ValidationIssue } from '../errors/AppError';

/**
 * Middleware validation pattern (Koa-style onion model).
 *
 * Each middleware receives the shared context and a `next` continuation.
 * A middleware may:
 *   - mutate `ctx.issues` and RETURN WITHOUT calling `next` to short-circuit,
 *   - call `next()` to defer to the rest of the chain.
 */
export interface MiddlewareContext<TInput> {
  readonly input: TInput;
  readonly meta: Map<string, unknown>;
  readonly issues: ValidationIssue[];
}

export type Next = () => void | Promise<void>;

export type Middleware<TInput> = (
  ctx: MiddlewareContext<TInput>,
  next: Next,
) => void | Promise<void>;

/** Outcome of running a pipeline: normalized input or collected issues. */
export type PipelineOutcome<TInput> =
  | { readonly ok: true; readonly value: TInput }
  | { readonly ok: false; readonly issues: readonly ValidationIssue[] };
