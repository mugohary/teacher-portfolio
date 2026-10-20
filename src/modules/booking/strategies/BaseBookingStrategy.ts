import { err, ok, type Result } from '@core/utils/result';
import { ConfigError } from '@core/errors/AppError';
import type { BookingOptions, BookingStrategy } from '../booking.types';
import { BOOKING_DEFAULTS } from '../booking.data';

/** Shared deep-link query assembly for all providers. */
export abstract class BaseBookingStrategy implements BookingStrategy {
  abstract readonly provider: 'calendly' | 'preply';
  abstract readonly displayName: string;

  protected abstract readonly baseUrl: string;

  validate(): Result<void, ConfigError> {
    if (!this.baseUrl) {
      return err(new ConfigError(`[${this.provider}] booking URL is not configured.`));
    }
    try {
      const url = new URL(this.baseUrl);
      if (url.protocol !== 'https:') {
        return err(new ConfigError(`[${this.provider}] booking URL must use https.`));
      }
      return ok(undefined);
    } catch {
      return err(new ConfigError(`[${this.provider}] booking URL is not a valid URL: ${this.baseUrl}`));
    }
  }

  abstract getDeepLink(options?: Partial<BookingOptions>): string;
  abstract mount(container: HTMLElement, options?: Partial<BookingOptions>): Promise<void>;

  destroy(): void {
    /* nothing to release by default */
  }

  /** Append UTM + service attribution to any booking URL. */
  protected withAttribution(options?: Partial<BookingOptions>): URL {
    const url = new URL(this.baseUrl);
    url.searchParams.set('utm_source', BOOKING_DEFAULTS.utmSource);
    url.searchParams.set('utm_medium', BOOKING_DEFAULTS.utmMedium);
    if (options?.preselectedService) {
      url.searchParams.set(BOOKING_DEFAULTS.serviceParam, options.preselectedService);
    }
    return url;
  }
}
