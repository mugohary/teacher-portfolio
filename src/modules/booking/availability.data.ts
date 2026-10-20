import type { LocalizedText } from '@core/types/shared';

export interface PrayerBreak {
  readonly name: LocalizedText;
  readonly time: string;
}

/**
 * Availability window. Times are Cairo (teacher-side); the booking widget
 * displays each student's local time automatically.
 */
export const AVAILABILITY = Object.freeze({
  days: {
    en: 'Weekends only — Saturday & Sunday',
    ar: 'نهاية الأسبوع فقط — السبت والأحد',
  },
  window: {
    en: '4:00 PM → 3:00 AM (Cairo time)',
    ar: '٤:٠٠ م ← ٣:٠٠ ص (بتوقيت القاهرة)',
  },
  sessionLength: {
    en: '30–60 minutes, flexible · 15-minute minimum',
    ar: '٣٠–٦٠ دقيقة حسب الراحة · الحد الأدنى ١٥ دقيقة',
  },
  format: {
    en: 'Fully remote, 1-on-1 online · group classes on Zoom when preferred · never in person',
    ar: 'عن بُعد بالكامل، فردي عبر الإنترنت · حصص جماعية عبر زوم عند الرغبة · لا حضور أبدًا',
  },
  timezoneNote: {
    en: 'The booking widget shows your local time — lessons are managed from Cairo.',
    ar: 'تعرض أداة الحجز وقتًا محليًا لك — تُدار الحصص من القاهرة.',
  },
  prayerBreaksNote: {
    en: 'Prayer breaks (45 min each, Cairo):',
    ar: 'استراحات صلاة (٤٥ دقيقة لكل واحدة، بتوقيت القاهرة):',
  },
  prayerBreaks: Object.freeze([
    { name: { en: 'Asr', ar: 'العصر' }, time: '4:13 PM' },
    { name: { en: 'Maghrib', ar: 'المغرب' }, time: '6:46 PM' },
    { name: { en: 'Isha', ar: 'العشاء' }, time: '8:04 PM' },
  ] as readonly PrayerBreak[]),
});
