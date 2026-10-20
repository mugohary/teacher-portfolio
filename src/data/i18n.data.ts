import type { LocalizedText } from '@core/types/shared';

/** UI chrome strings (labels, actions, validation copy). Domain content lives in each module's data file. */
export const UI_STRINGS = {
  nav_home: { en: 'Home', ar: 'الرئيسية' },
  nav_about: { en: 'About', ar: 'نبذة' },
  nav_services: { en: 'Services', ar: 'الخدمات' },
  nav_booking: { en: 'Book a Lesson', ar: 'احجز درسًا' },
  nav_contact: { en: 'Contact', ar: 'تواصل' },
  nav_toggle_language: { en: 'العربية', ar: 'English' },

  hero_eyebrow: { en: 'Arabic & Quran Teacher — Fully Remote', ar: 'معلم العربية والقرآن — عن بُعد بالكامل' },
  hero_cta_booking: { en: 'Book a Lesson', ar: 'احجز درسًا' },
  hero_cta_services: { en: 'Explore Services', ar: 'استعرض الخدمات' },

  section_bio: { en: 'About the Teacher', ar: 'عن المعلم' },
  section_credentials: { en: 'Credentials', ar: 'المؤهلات' },
  section_approach: { en: 'Teaching Approach', ar: 'منهجية التدريس' },
  section_availability: { en: 'Availability', ar: 'أوقات التوفر' },
  section_services: { en: 'Services', ar: 'الخدمات' },
  section_booking: { en: 'Book a Lesson', ar: 'احجز درسًا' },
  section_contact: { en: 'Get in Touch', ar: 'تواصل معنا' },

  label_online: { en: '1-on-1 online', ar: 'فردي عن بُعد' },

  booking_hint: {
    en: 'Pick a time that works for you — you will receive a confirmation by email.',
    ar: 'اختر الوقت المناسب لك — سيصلك تأكيد عبر البريد الإلكتروني.',
  },
  booking_fallback: {
    en: 'Scheduler unavailable? Book directly:',
    ar: 'تعذر جدول المواعيد؟ احجز مباشرة:',
  },
  booking_coming_soon: {
    en: 'Online booking is opening soon — send me a message and I will reserve your free trial personally.',
    ar: 'سيفتح الحجز الإلكتروني قريبًا — أرسل لي رسالة وسأحجز لك درسك التجريبي بنفسّي.',
  },
  booking_coming_soon_cta: { en: 'Request your lesson', ar: 'اطلب درسك' },

  contact_name: { en: 'Full name', ar: 'الاسم الكامل' },
  contact_email: { en: 'Email address', ar: 'البريد الإلكتروني' },
  contact_subject: { en: 'Subject', ar: 'الموضوع' },
  contact_message: { en: 'Message', ar: 'الرسالة' },
  contact_submit: { en: 'Send Message', ar: 'إرسال الرسالة' },
  contact_sending: { en: 'Sending…', ar: 'جارٍ الإرسال…' },
  contact_whatsapp: { en: 'Chat on WhatsApp', ar: 'تواصل عبر واتساب' },
  contact_telegram: { en: 'Chat on Telegram', ar: 'تواصل عبر تيليجرام' },
  contact_email_direct: { en: 'Send an email', ar: 'أرسل بريدًا' },
  contact_preply: { en: 'Preply profile', ar: 'ملف بريبلي' },
  contact_direct: { en: 'Direct channels', ar: 'قنوات التواصل المباشر' },
  contact_success: {
    en: 'Your message is ready — choose how to send it.',
    ar: 'رسالتك جاهزة — اختر طريقة الإرسال.',
  },

  error_required: { en: 'This field is required.', ar: 'هذا الحقل مطلوب.' },
  error_email: { en: 'Please enter a valid email address.', ar: 'يرجى إدخال بريد إلكتروني صحيح.' },
  error_minLength: { en: 'Please add a bit more detail.', ar: 'يرجى إضافة تفاصيل أكثر.' },
  error_maxLength: { en: 'This is longer than the allowed limit.', ar: 'هذا يتجاوز الحد المسموح.' },
  error_noHtml: { en: 'HTML is not allowed here.', ar: 'لا يُسمح باستخدام HTML هنا.' },
  error_generic: { en: 'Something went wrong. Please review the form.', ar: 'حدث خطأ ما. يرجى مراجعة النموذج.' },

  footer_rights: { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
} satisfies Record<string, LocalizedText>;

export type UIStringKey = keyof typeof UI_STRINGS;
