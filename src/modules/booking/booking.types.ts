import type { Locale } from '@core/types/shared';
import type { Result } from '@core/utils/result';
import type { ConfigError } from '@core/errors/AppError';

export type BookingProvider = 'calendly' | 'preply';

/** Input the factory needs to pick a concrete strategy. */
export interface BookingConfigSource {
  readonly mode: 'calendly' | 'preply' | 'auto';
  readonly calendlyUrl: string | null;
  readonly preplyUrl: string | null;
  readonly autoFallbackOrder: readonly BookingProvider[];
}

export interface BookingOptions {
  readonly locale: Locale;
  /** Service slug/title to pre-fill where the provider supports it. */
  readonly preselectedService?: string;
  readonly visitorName?: string;
  readonly visitorEmail?: string;
}

/**
 * Strategy Pattern contract: every booking provider implements the same
 * interface so the BookingModule never branches on provider names.
 */
export interface BookingStrategy {
  readonly provider: BookingProvider;
  readonly displayName: string;

  /** Fail fast on malformed configuration (Result instead of throw). */
  validate(): Result<void, ConfigError>;

  /** Public URL a visitor can always fall back to. */
  getDeepLink(options?: Partial<BookingOptions>): string;

  /** Render the provider experience into a container (inline where possible). */
  mount(container: HTMLElement, options?: Partial<BookingOptions>): Promise<void>;

  /** Cleanup any injected resources. */
  destroy(): void;
}
