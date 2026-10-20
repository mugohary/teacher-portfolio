import { h } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import { AVAILABILITY } from '../availability.data';

function factCard(label: string, value: string, accent: 'gold' | 'teal'): HTMLElement {
  return h('div', {
    className: `rounded-xl border px-4 py-3 ${accent === 'gold' ? 'border-gold-400/25 bg-gold-400/5' : 'border-teal-400/25 bg-teal-400/5'}`,
  }, [
    h('p', { className: 'text-[11px] tracking-wider text-sand-300/55 uppercase', text: label }),
    h('p', { className: 'mt-1 font-display text-sm font-medium text-sand-100', text: value }),
  ]);
}

/** When, how and how long — shown above the booking embed. */
export function createAvailabilityPanel(i18n: I18nService): HTMLElement {
  const isAr = i18n.locale === 'ar';

  return h('section', {
    id: 'availability',
    attrs: { 'aria-labelledby': 'availability-heading' },
    className: 'mb-10 rounded-2xl border border-white/10 bg-night-800/40 p-6 backdrop-blur-sm md:p-8',
  }, [
    h('div', { className: 'mb-5 flex flex-wrap items-center justify-between gap-3' }, [
      h('h3', {
        id: 'availability-heading',
        className: 'font-display text-lg font-semibold text-sand-100',
        text: i18n.translate('section_availability'),
      }),
      h('span', {
        className: 'rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] text-teal-300',
        text: isAr ? 'المواعيد بتوقيت القاهرة' : 'Times in Cairo',
      }),
    ]),

    h('div', { className: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4' }, [
      factCard(isAr ? 'الأيام' : 'Days', i18n.t(AVAILABILITY.days), 'gold'),
      factCard(isAr ? 'النافذة الزمنية' : 'Window', i18n.t(AVAILABILITY.window), 'gold'),
      factCard(isAr ? 'مدة الحصة' : 'Session length', i18n.t(AVAILABILITY.sessionLength), 'teal'),
      factCard(isAr ? 'النمط' : 'Format', i18n.t(AVAILABILITY.format), 'teal'),
    ]),

    h('p', { className: 'mt-4 text-xs text-sand-300/60', text: i18n.t(AVAILABILITY.timezoneNote) }),

    h('div', { className: 'mt-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3' }, [
      h('p', { className: 'text-xs font-medium text-sand-300/70', text: i18n.t(AVAILABILITY.prayerBreaksNote) }),
      h('ul', { className: 'mt-2 flex flex-wrap gap-2' },
        AVAILABILITY.prayerBreaks.map((breakSlot) =>
          h('li', {
            className: 'rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-[11px] font-medium text-gold-300',
            text: `${isAr ? breakSlot.name.ar : breakSlot.name.en} · ${breakSlot.time}`,
          }),
        ),
      ),
    ]),
  ]);
}
