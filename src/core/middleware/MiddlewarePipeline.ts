import type {
  Middleware,
  MiddlewareContext,
  PipelineOutcome,
} from './types';

/**
 * Composable validation pipeline.
 *
 * Middlewares run in registration order. The chain is a classic dispatcher:
 * `dispatch(i)` invokes stack[i], which decides whether to continue by
 * calling `next()` → `dispatch(i + 1)`.
 */
export class MiddlewarePipeline<TInput> {
  private readonly stack: Middleware<TInput>[] = [];

  use(...middlewares: Middleware<TInput>[]): this {
    this.stack.push(...middlewares);
    return this;
  }

  async run(input: TInput): Promise<PipelineOutcome<TInput>> {
    const ctx: MiddlewareContext<TInput> = {
      input,
      meta: new Map(),
      issues: [],
    };

    let lastIndex = -1;
    const dispatch = async (index: number): Promise<void> => {
      if (index <= lastIndex) {
        throw new Error('next() called multiple times in the same middleware.');
      }
      lastIndex = index;
      const middleware = this.stack[index];
      if (!middleware) return;
      await middleware(ctx, () => dispatch(index + 1));
    };

    await dispatch(0);

    if (ctx.issues.length > 0) {
      return { ok: false, issues: ctx.issues };
    }
    return { ok: true, value: input };
  }
}
