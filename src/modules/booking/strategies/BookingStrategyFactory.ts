import { err, ok, type Result } from '@core/utils/result';
import { ConfigError } from '@core/errors/AppError';
import type { I18nService } from '@core/i18n/I18nService';
import type { BookingConfigSource, BookingProvider, BookingStrategy } from '../booking.types';
import { CalendlyStrategy } from './CalendlyStrategy';
import { PreplyStrategy } from './PreplyStrategy';

/**
 * Strategy Factory — resolves the configured booking provider into a
 * concrete strategy, failing loudly when misconfigured.
 */
export class BookingStrategyFactory {
  static create(config: BookingConfigSource, i18n: I18nService): Result<BookingStrategy, ConfigError> {
    const resolved = BookingStrategyFactory.resolve(config);
    if (!resolved) {
      return err(
        new ConfigError(
          'No booking provider configured. Set VITE_CALENDLY_URL and/or VITE_PREPLY_URL.',
          { mode: config.mode },
        ),
      );
    }

    const [provider, url] = resolved;
    const strategy: BookingStrategy =
      provider === 'calendly' ? new CalendlyStrategy(url) : new PreplyStrategy(url, i18n);

    const validation = strategy.validate();
    if (!validation.ok) return err(validation.error);
    return ok(strategy);
  }

  private static resolve(
    config: BookingConfigSource,
  ): [BookingProvider, string] | null {
    switch (config.mode) {
      case 'calendly':
        return config.calendlyUrl ? ['calendly', config.calendlyUrl] : null;
      case 'preply':
        return config.preplyUrl ? ['preply', config.preplyUrl] : null;
      case 'auto':
      default: {
        for (const provider of config.autoFallbackOrder) {
          const url = provider === 'calendly' ? config.calendlyUrl : config.preplyUrl;
          if (url) return [provider, url];
        }
        return null;
      }
    }
  }
}
