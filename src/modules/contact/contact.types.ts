import type { Locale, LocalizedText } from '@core/types/shared';
import type { ContactDTO } from './dto/ContactDTO';

export type ContactSubject = 'general' | 'trial' | 'course' | 'ijazah' | 'kids';

export const CONTACT_SUBJECTS: readonly ContactSubject[] = [
  'general',
  'trial',
  'course',
  'ijazah',
  'kids',
];

export const SUBJECT_LABELS: Readonly<Record<ContactSubject, LocalizedText>> = {
  general: { en: 'General inquiry', ar: 'استفسار عام' },
  trial: { en: 'Free trial lesson', ar: 'درس تجريبي مجاني' },
  course: { en: 'Course enrollment', ar: 'التسجيل في دورة' },
  ijazah: { en: 'Ijazah track', ar: 'مسار الإجازة' },
  kids: { en: 'Lessons for kids', ar: 'دروس للأطفال' },
};

/** Raw, untrusted form payload entering the DTO boundary. */
export interface ContactInput extends Record<string, unknown> {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Normalized contact directory (from environment-backed repository). */
export interface ContactDirectory {
  readonly email: string;
  readonly whatsapp: string;
  readonly whatsappBase: string;
  /** Telegram username without "@". */
  readonly telegram: string;
  readonly telegramBase: string;
  /** Preply profile URL (may be null until configured). */
  readonly preplyUrl: string | null;
}

export type ContactChannelId = 'whatsapp' | 'telegram' | 'email';

/** Strategy-style delivery channel for a validated message. */
export interface ContactChannelHandler {
  readonly id: ContactChannelId;
  readonly label: LocalizedText;
  isAvailable(directory: ContactDirectory): boolean;
  buildUrl(dto: ContactDTO, directory: ContactDirectory): string;
  /** Hand the URL (and optionally the message for channels that need pasting) to the browser. */
  deliver(url: string, dto?: ContactDTO): void;
}
