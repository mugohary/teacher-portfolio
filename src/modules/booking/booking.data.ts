/** Defaults applied to every outgoing booking deep link. */
export const BOOKING_DEFAULTS = Object.freeze({
  utmSource: 'teacher-portfolio',
  utmMedium: 'website',
  /** Provider-agnostic service pre-selection query key. */
  serviceParam: 'service',
});

/** Booking section chrome copy that is domain-specific (not form UI). */
export const BOOKING_COPY = Object.freeze({
  badge: { en: 'Live schedule', ar: 'جدول مباشر' },
  calendlyName: { en: 'Calendly', ar: 'كالندلي' },
  preplyName: { en: 'Preply', ar: 'بريبلي' },
  preplyCta: {
    en: 'Open my Preply profile to choose a package & trial lesson',
    ar: 'افتح ملفي على بريبلي لاختيار الباقة والدرس التجريبي',
  },
});
