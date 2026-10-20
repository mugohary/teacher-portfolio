import { AppError } from './AppError';

export interface ErrorReporter {
  report(error: AppError): void;
}

/**
 * Console reporter (default). Swap for a telemetry implementation
 * (Sentry, Plausible on-error, ...) by passing a custom reporter.
 */
export class ConsoleErrorReporter implements ErrorReporter {
  report(error: AppError): void {
    if (import.meta.env.DEV) {
      console.error(`[AppError:${error.code}]`, error.message, error.details ?? '');
    }
  }
}

/**
 * Global error boundary: catches uncaught exceptions / rejected promises,
 * normalizes them to AppError and delegates to a reporter + UI fallback.
 */
export class ErrorHandler {
  private readonly reporter: ErrorReporter;

  constructor(reporter: ErrorReporter = new ConsoleErrorReporter()) {
    this.reporter = reporter;
  }

  handle(error: unknown, context?: string): AppError {
    const appError = AppError.from(error);
    if (context) {
      appError.details ? (appError.details.context = context) : void 0;
    }
    this.reporter.report(appError);
    return appError;
  }

  /** Render a minimal, accessible failure state into a container. */
  renderFallback(container: HTMLElement, error: AppError): void {
    container.replaceChildren();
    const box = document.createElement('div');
    box.setAttribute('role', 'alert');
    box.className =
      'rounded-xl border border-amber-300/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100';
    box.textContent = 'This section is temporarily unavailable. Please refresh the page.';
    container.append(box);
  }

  installGlobalListeners(): void {
    window.addEventListener('error', (event) => {
      this.handle(event.error ?? event.message, 'window.error');
    });
    window.addEventListener('unhandledrejection', (event) => {
      this.handle(event.reason, 'unhandledrejection');
    });
  }
}

export const errorHandler = new ErrorHandler();
