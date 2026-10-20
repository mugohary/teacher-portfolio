import { h } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import { BaseBookingStrategy } from './BaseBookingStrategy';
import type { BookingOptions } from '../booking.types';
import { BOOKING_COPY } from '../booking.data';

/**
 * Preply strategy — Preply does not allow third-party inline embeds, so
 * this strategy renders a branded CTA card that deep-links to the teacher's
 * Preply profile (with UTM + service attribution) in a new tab.
 */
export class PreplyStrategy extends BaseBookingStrategy {
  readonly provider = 'preply' as const;
  readonly displayName = BOOKING_COPY.preplyName.en;

  protected get baseUrl(): string {
    return this.url;
  }

  constructor(
    private readonly url: string,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  override getDeepLink(options?: Partial<BookingOptions>): string {
    const url = this.withAttribution(options);
    return url.toString();
  }

  override async mount(container: HTMLElement, options?: Partial<BookingOptions>): Promise<void> {
    const href = this.getDeepLink(options);
    const serviceLine = options?.preselectedService
      ? this.i18n.locale === 'ar'
        ? `الخدمة المختارة: ${options.preselectedService}`
        : `Selected service: ${options.preselectedService}`
      : null;

    const card = h('div', {
      className:
        'flex flex-col items-center justify-center gap-5 rounded-2xl border border-teal-400/25 bg-night-800/50 px-8 py-16 text-center',
    }, [
      h('span', {
        className: 'rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs tracking-widest text-teal-300 uppercase',
        text: BOOKING_COPY.badge[this.i18n.locale],
      }),
      h('p', { className: 'max-w-md text-sand-300/85', text: this.i18n.translate('booking_hint') }),
      serviceLine ? h('p', { className: 'text-sm text-gold-300', text: serviceLine }) : null,
      h('a', {
        href,
        attrs: { target: '_blank', rel: 'noopener noreferrer' },
        className:
          'rounded-full bg-teal-400 px-8 py-3 font-display text-sm font-semibold text-night-950 transition hover:bg-teal-300 focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:outline-none',
        text: this.i18n.t(BOOKING_COPY.preplyCta),
      }),
      h('p', { className: 'text-xs text-sand-300/50', text: this.i18n.translate('booking_fallback') }),
    ]);

    container.replaceChildren(card);
  }
}
