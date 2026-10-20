import { h } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import type { ProfileStat, TeacherProfile } from '../bio.types';

function statChip(stat: ProfileStat, i18n: I18nService): HTMLElement {
  return h('div', { className: 'flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm' }, [
    h('span', { className: 'font-display text-2xl font-semibold text-gold-400', text: i18n.t(stat.value) }),
    h('span', { className: 'mt-1 text-xs tracking-wide text-sand-300/80', text: i18n.t(stat.label) }),
  ]);
}

/** Hero: identity, value proposition, primary CTAs and trust stats. */
export function createHeroSection(
  profile: TeacherProfile,
  i18n: I18nService,
  onBook: () => void,
): HTMLElement {
  const onExplore = (): void => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return h('section', { id: 'home', attrs: { 'aria-labelledby': 'hero-heading' }, className: 'relative overflow-hidden' }, [
    h('div', {
      attrs: { 'aria-hidden': 'true' },
      className:
        'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_70%_-10%,rgba(45,212,191,0.14),transparent_60%),radial-gradient(50%_40%_at_10%_10%,rgba(230,194,117,0.10),transparent_55%)]',
    }),

    h('div', { className: 'mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-20 md:grid-cols-[1.15fr_0.85fr] md:pt-24' }, [
      h('div', {}, [
        h('p', {
          className: 'mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-medium tracking-widest text-gold-300 uppercase',
          text: i18n.translate('hero_eyebrow'),
        }),
        h('h1', { id: 'hero-heading', className: 'font-display text-4xl leading-tight font-bold text-sand-100 md:text-6xl' }, [
          h('span', { className: 'block text-gold-400', text: i18n.t(profile.honorific) }),
          h('span', { text: i18n.t(profile.fullName) }),
        ]),
        h('p', {
          className: 'mt-3 font-arabic text-xl text-teal-300/90',
          text: i18n.t(profile.discipline),
        }),
        h('p', {
          className: 'mt-6 max-w-xl text-lg leading-relaxed text-sand-300/85',
          text: i18n.t(profile.tagline),
        }),

        h('div', { className: 'mt-9 flex flex-wrap gap-4' }, [
          h('button', {
            type: 'button',
            className:
              'rounded-full bg-gold-400 px-7 py-3 font-display text-sm font-semibold text-night-950 transition hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950 focus-visible:outline-none',
            text: i18n.translate('hero_cta_booking'),
            on: { click: onBook },
          }),
          h('button', {
            type: 'button',
            className:
              'rounded-full border border-sand-300/25 px-7 py-3 font-display text-sm font-semibold text-sand-100 transition hover:border-gold-400/60 hover:text-gold-300',
            text: i18n.translate('hero_cta_services'),
            on: { click: onExplore },
          }),
        ]),

        h('div', { className: 'mt-10 flex flex-wrap gap-3' },
          profile.stats.map((stat) => statChip(stat, i18n)),
        ),
      ]),

      h('div', { className: 'relative mx-auto w-full max-w-sm' }, [
        h('div', {
          attrs: { 'aria-hidden': 'true' },
          className: 'absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-gold-400/30 via-teal-400/20 to-transparent blur-xl',
        }),
        h('figure', { className: 'relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-night-800/60 p-2 backdrop-blur' }, [
          h('img', {
            src: profile.photoUrl,
            alt: i18n.t(profile.fullName),
            attrs: { width: 320, height: 320, decoding: 'async', fetchpriority: 'high' },
            className: 'aspect-square w-full rounded-[1.4rem] object-cover',
          }),
          h('figcaption', {
            className: 'px-4 py-3 text-center text-xs text-sand-300/70',
            text: `${i18n.t(profile.nativeLanguage)} · ${profile.teachingLanguages.map((lang) => i18n.t(lang)).join(' · ')}`,
          }),
        ]),
      ]),
    ]),
  ]);
}
