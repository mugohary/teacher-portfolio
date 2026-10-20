import { h } from '@core/utils/dom';
import { BaseBookingStrategy } from './BaseBookingStrategy';
import type { BookingOptions } from '../booking.types';
import { BOOKING_COPY } from '../booking.data';

const IFRAME_MIN_HEIGHT_PX = 720;

/**
 * Calendly strategy — renders the scheduler as a same-origin-free inline
 * iframe using Calendly's embed URL. Deliberately avoids their tracking JS
 * bundle (keeps the page zero-bloat); only the iframe loads.
 */
export class CalendlyStrategy extends BaseBookingStrategy {
  readonly provider = 'calendly' as const;
  readonly displayName = BOOKING_COPY.calendlyName.en;

  protected get baseUrl(): string {
    return this.url;
  }

  constructor(private readonly url: string) {
    super();
  }

  override getDeepLink(options?: Partial<BookingOptions>): string {
    const url = this.withAttribution(options);
    if (options?.visitorName) url.searchParams.set('name', options.visitorName);
    if (options?.visitorEmail) url.searchParams.set('email', options.visitorEmail);
    return url.toString();
  }

  override async mount(container: HTMLElement, options?: Partial<BookingOptions>): Promise<void> {
    const src = new URL(this.getDeepLink(options));
    src.searchParams.set('embed_domain', window.location.host);
    src.searchParams.set('embed_type', 'Inline');

    const iframe = h('iframe', {
      attrs: {
        src: src.toString(),
        title: 'Lesson scheduling calendar',
        loading: 'lazy',
        width: '100%',
        frameborder: '0',
        scrolling: 'no',
      },
      className: 'w-full rounded-2xl border border-white/10 bg-white',
      style: { 'min-height': `${IFRAME_MIN_HEIGHT_PX}px` },
    });

    container.replaceChildren(iframe);
  }
}
