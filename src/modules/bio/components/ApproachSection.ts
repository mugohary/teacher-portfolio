import { h } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import type { ApproachCard } from '../bio.types';

function approachCard(card: ApproachCard, index: number, i18n: I18nService): HTMLElement {
  const accent = index % 2 === 0 ? 'border-gold-400/30' : 'border-teal-400/30';
  const number = index % 2 === 0 ? 'text-gold-400' : 'text-teal-400';

  return h('article', {
    className: `flex flex-col rounded-2xl border ${accent} bg-night-800/40 p-6 backdrop-blur-sm`,
  }, [
    h('div', { className: 'flex items-center gap-3' }, [
      h('span', {
        attrs: { 'aria-hidden': 'true' },
        className: `font-display text-2xl font-bold ${number}`,
        text: String(index + 1).padStart(2, '0'),
      }),
      h('h4', { className: 'font-display text-base font-semibold text-sand-100', text: i18n.t(card.title) }),
    ]),
    card.summary
      ? h('p', { className: 'mt-3 text-sm text-sand-300/75', text: i18n.t(card.summary) })
      : null,
    h('ol', { className: 'mt-4 space-y-2.5' },
      card.steps.map((step, stepIndex) =>
        h('li', { className: 'flex items-start gap-2.5 text-sm text-sand-300/80' }, [
          h('span', {
            className: `mt-1.5 h-1.5 w-1.5 shrink-rounded-full shrink-0 ${index % 2 === 0 ? 'bg-gold-400/80' : 'bg-teal-400/80'}`,
            attrs: { 'aria-hidden': 'true' },
          }),
          h('span', {}, [
            h('span', { className: 'me-1.5 text-[10px] text-sand-300/40', text: `${stepIndex + 1}.` }),
            h('span', { text: i18n.t(step) }),
          ]),
        ]),
      ),
    ),
    card.note
      ? h('p', {
          className: 'mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs leading-relaxed text-sand-300/70',
          text: i18n.t(card.note),
        })
      : null,
  ]);
}

/** Teaching approach: how Arabic, Quran and Tajweed lessons actually run. */
export function createApproachSection(
  cards: readonly ApproachCard[],
  i18n: I18nService,
): HTMLElement {
  return h('section', { id: 'approach-panel', className: 'mx-auto max-w-6xl px-6 pb-24' }, [
    h('div', { className: 'mb-8 max-w-2xl' }, [
      h('h2', {
        id: 'approach',
        className: 'font-display text-3xl font-bold text-sand-100 md:text-4xl',
        text: i18n.translate('section_approach'),
      }),
      h('p', {
        className: 'mt-3 text-sand-300/75',
        text: i18n.locale === 'ar'
          ? 'هكذا تسير الحصص فعليًا — وكل بند قابل للتكييف حسب الطالب.'
          : 'How lessons actually run — every step adapts to the student.',
      }),
    ]),
    h('div', { className: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-4' },
      cards.map((card, index) => approachCard(card, index, i18n)),
    ),
  ]);
}
