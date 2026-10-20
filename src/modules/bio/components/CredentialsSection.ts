import { h } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import type { LocalizedText } from '@core/types/shared';
import type { Credential, TeacherProfile } from '../bio.types';

const KIND_ACCENT: Record<Credential['kind'], { dot: string; badge: string }> = {
  degree: { dot: 'bg-gold-400', badge: 'border-gold-400/40 text-gold-300' },
  certificate: { dot: 'bg-teal-400', badge: 'border-teal-400/40 text-teal-300' },
  ijazah: { dot: 'bg-gold-400', badge: 'border-gold-400/40 text-gold-300' },
  experience: { dot: 'bg-sand-300/70', badge: 'border-sand-300/30 text-sand-300' },
};

const KIND_LABELS: Record<Credential['kind'], LocalizedText> = {
  degree: { en: 'Degree', ar: 'درجة' },
  certificate: { en: 'Certificate', ar: 'شهادة' },
  ijazah: { en: 'Ijazah', ar: 'إجازة' },
  experience: { en: 'Experience', ar: 'خبرة' },
};

function credentialItem(credential: Credential, i18n: I18nService): HTMLElement {
  const { dot, badge } = KIND_ACCENT[credential.kind];

  return h('li', { className: 'relative ps-5' }, [
    h('span', {
      attrs: { 'aria-hidden': 'true' },
      className: `absolute start-0 top-2 h-2 w-2 rounded-full ${dot}`,
    }),
    h('div', { className: 'flex flex-wrap items-baseline justify-between gap-2' }, [
      h('p', { className: 'font-display text-sm font-medium text-sand-100', text: i18n.t(credential.title) }),
      h('span', {
        className: `rounded-full border px-2.5 py-0.5 font-display text-[11px] font-semibold ${badge}`,
        text: i18n.t(KIND_LABELS[credential.kind]),
      }),
    ]),
    credential.issuer
      ? h('p', { className: 'mt-1 text-sm text-sand-300/70', text: i18n.t(credential.issuer) })
      : null,
    credential.detail
      ? h('p', { className: 'mt-2 text-xs leading-relaxed text-sand-300/60', text: i18n.t(credential.detail) })
      : null,
  ]);
}

function glanceFacts(profile: TeacherProfile, i18n: I18nService): (readonly [LocalizedText, LocalizedText])[] {
  return [
    [{ en: 'Audience', ar: 'الفئة المستهدفة' }, profile.audience],
    [{ en: 'Format', ar: 'نمط الدروس' }, profile.format],
    [{ en: 'Session length', ar: 'مدة الحصة' }, profile.sessionLength],
    [{ en: 'Teaches in', ar: 'يشرح بـ' }, {
      en: profile.teachingLanguages.map((l) => l.en).join(' · '),
      ar: profile.teachingLanguages.map((l) => l.ar).join(' · '),
    }],
  ];
}

function introPanel(profile: TeacherProfile, i18n: I18nService): HTMLElement {
  return h('article', { className: 'rounded-2xl border border-white/10 bg-gradient-to-b from-night-800/50 to-night-900/30 p-6 md:p-8' }, [
    h('h2', {
      id: 'about',
      attrs: { 'aria-label': i18n.translate('section_bio') },
      className: 'font-display text-2xl font-bold text-sand-100',
      text: i18n.translate('section_bio'),
    }),
    h('p', { className: 'mt-4 leading-relaxed text-sand-300/85', text: i18n.t(profile.intro) }),
    h('dl', { className: 'mt-6 grid gap-3 sm:grid-cols-2' },
      glanceFacts(profile, i18n).map(([label, value]) =>
        h('div', { className: 'rounded-xl border border-white/5 bg-white/5 px-4 py-3' }, [
          h('dt', { className: 'text-[11px] tracking-wider text-sand-300/55 uppercase', text: i18n.t(label) }),
          h('dd', { className: 'mt-1 text-sm text-sand-100', text: i18n.t(value) }),
        ]),
      ),
    ),
  ]);
}

/** About (with at-a-glance facts) + credentials list. */
export function createCredentialsSection(profile: TeacherProfile, i18n: I18nService): HTMLElement {
  return h('section', { id: 'about-panel', className: 'mx-auto max-w-6xl px-6 pb-24' }, [
    introPanel(profile, i18n),
    h('article', {
      className: 'mt-8 rounded-2xl border border-white/10 bg-night-800/40 p-6 backdrop-blur-sm md:p-8',
    }, [
      h('h3', {
        className: 'font-display text-lg font-semibold text-sand-100',
        text: i18n.translate('section_credentials'),
      }),
      h('ul', { className: 'mt-5 grid gap-5 md:grid-cols-3' },
        profile.credentials.map((credential) => credentialItem(credential, i18n)),
      ),
    ]),
  ]);
}
