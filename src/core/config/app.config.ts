import { env, type BookingProviderMode } from './env';

/** Booking provider configuration resolved from the environment. */
export interface BookingConfig {
  readonly mode: BookingProviderMode;
  readonly calendlyUrl: string | null;
  readonly preplyUrl: string | null;
  /** When mode is "auto", which provider wins if both are configured. */
  readonly autoFallbackOrder: readonly ('calendly' | 'preply')[];
}

export interface ContactConfig {
  readonly email: string;
  readonly whatsapp: string;
  /** wa.me deep-link base. */
  readonly whatsappBase: string;
  /** Telegram username without "@". */
  readonly telegram: string;
  /** t.me deep-link base. */
  readonly telegramBase: string;
}

export interface AppConfig {
  readonly siteUrl: string;
  readonly siteName: string;
  readonly year: number;
  readonly booking: BookingConfig;
  readonly contact: ContactConfig;
}

export const appConfig: AppConfig = Object.freeze({
  siteUrl: env.siteUrl,
  siteName: env.siteName,
  year: new Date().getFullYear(),
  booking: Object.freeze({
    mode: env.bookingProvider,
    calendlyUrl: env.calendlyUrl,
    preplyUrl: env.preplyUrl,
    autoFallbackOrder: ['calendly', 'preply'] as const,
  }),
  contact: Object.freeze({
    email: env.contactEmail,
    whatsapp: env.contactWhatsApp,
    whatsappBase: 'https://wa.me',
    telegram: env.contactTelegram,
    telegramBase: 'https://t.me',
  }),
});
