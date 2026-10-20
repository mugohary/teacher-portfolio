import { h, svgElement } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import type { ServiceIcon, ServiceOffering } from '../services.types';
import { SERVICE_LEVEL_LABELS } from '../services.types';

const ICON_PATHS: Record<ServiceIcon, string> = {
  // Simple, single-color line icons (24×24 viewBox).
  book: 'M4 5a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2V5Zm2 15a2 2 0 0 1 2-2h11',
  quran: 'M12 6c-2-1.5-4.5-2-8-2v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2Zm0 0v13',
  star: 'm12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3Z',
  smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9 10h.01M15 10h.01M8.5 14.5s1.2 1.5 3.5 1.5 3.5-1.5 3.5-1.5',
  crescent: 'M18.5 14.8A7.6 7.6 0 1 1 10 4.4a6 6 0 0 0 8.5 10.4Z',
};

function serviceIcon(name: ServiceIcon): SVGElement {
  const svg = svgElement('svg', {
    className: 'h-6 w-6',
    attrs: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.6',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
  });
  svg.append(svgElement('path', { attrs: { d: ICON_PATHS[name] } }));
  return svg;
}

function checkIcon(): SVGElement {
  const svg = svgElement('svg', {
    className: 'mt-0.5 h-4 w-4 shrink-0 text-gold-400/80',
    attrs: { viewBox: '0 0 20 20', fill: 'currentColor', 'aria-hidden': 'true' },
  });
  svg.append(
    svgElement('path', {
      attrs: {
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        d: 'M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z',
      },
    }),
  );
  return svg;
}

export interface ServiceCardOptions {
  readonly onBook: (service: ServiceOffering) => void;
}

/** Card for a single service offering. Pricing is never rendered (private). */
export function createServiceCard(
  service: ServiceOffering,
  i18n: I18nService,
  options: ServiceCardOptions,
): HTMLElement {
  const isFeatured = service.featured;

  return h('article', {
    dataset: { serviceCard: service.category },
    className: [
      'group relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm transition',
      isFeatured
        ? 'border-gold-400/40 bg-gradient-to-b from-night-800/70 to-night-900/40 shadow-[0_0_40px_-18px_rgba(230,194,117,0.5)]'
        : 'border-white/10 bg-night-800/40 hover:border-teal-400/40',
    ].join(' '),
  }, [
    service.badge
      ? h('span', {
          className:
            'absolute -top-3 start-6 rounded-full bg-gold-400 px-3 py-1 font-display text-[11px] font-semibold text-night-950',
          text: i18n.t(service.badge),
        })
      : null,

    h('div', { className: 'flex items-center gap-3' }, [
      h('span', {
        className: 'rounded-xl border border-teal-400/30 bg-teal-400/10 p-2.5 text-teal-300',
      }, [serviceIcon(service.icon)]),
      h('h3', { className: 'font-display text-lg font-semibold text-sand-100', text: i18n.t(service.name) }),
    ]),

    h('p', { className: 'mt-4 text-sm leading-relaxed text-sand-300/80', text: i18n.t(service.summary) }),

    h('ul', { className: 'mt-5 space-y-2' },
      service.includes.map((item) =>
        h('li', { className: 'flex items-start gap-2 text-sm text-sand-300/75' }, [
          checkIcon(),
          h('span', { text: i18n.t(item) }),
        ]),
      ),
    ),

    h('div', { className: 'mt-6 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4' }, [
      h('span', { className: 'rounded-full bg-white/5 px-3 py-1 text-[11px] text-sand-300/70', text: i18n.t(service.sessionLength) }),
      h('span', { className: 'rounded-full bg-white/5 px-3 py-1 text-[11px] text-sand-300/70', text: i18n.translate('label_online') }),
      service.audience
        ? h('span', { className: 'rounded-full bg-teal-400/10 px-3 py-1 text-[11px] text-teal-300', text: i18n.t(service.audience) })
        : null,
      ...(service.levels ?? []).map((level) =>
        h('span', { className: 'rounded-full bg-white/5 px-3 py-1 text-[11px] text-sand-300/70', text: i18n.t(SERVICE_LEVEL_LABELS[level]) }),
      ),
    ]),

    h('button', {
      type: 'button',
      className:
        'mt-5 w-full rounded-xl border border-gold-400/40 py-2.5 font-display text-sm font-semibold text-gold-300 transition hover:bg-gold-400 hover:text-night-950 focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:outline-none',
      text: i18n.translate('nav_booking'),
      on: { click: () => options.onBook(service) },
    }),
  ]);
}
