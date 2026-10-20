import { h } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import type { BookingStrategy } from '../booking.types';
import { createAvailabilityPanel } from './AvailabilityPanel';

/** Section chrome: availability facts + whatever strategy the factory produced. */
export function createBookingPanel(
  strategy: BookingStrategy,
  i18n: I18nService,
  embedHost: HTMLElement,
): HTMLElement {
  return h('section', { id: 'booking-panel', className: 'mx-auto max-w-6xl px-6 pb-24' }, [
    h('div', { className: 'mx-auto mb-10 max-w-2xl text-center' }, [
      h('span', {
        className: 'rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs tracking-widest text-teal-300 uppercase',
        text: i18n.locale === 'ar' ? 'جدول مباشر' : 'Live schedule',
      }),
      h('h2', {
        id: 'booking',
        className: 'mt-4 font-display text-3xl font-bold text-sand-100 md:text-4xl',
        text: i18n.translate('section_booking'),
      }),
      h('p', { className: 'mt-3 text-sand-300/75', text: i18n.translate('booking_hint') }),
      h('p', { className: 'mt-1 text-xs text-sand-300/50', text: strategy.displayName }),
    ]),
    createAvailabilityPanel(i18n),
    embedHost,
  ]);
}
