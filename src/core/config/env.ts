import type { Direction, Locale } from '../types/shared';
import { AppError } from '../errors/AppError';

export type BookingProviderMode = 'calendly' | 'preply' | 'auto';

/** Typed, validated view over Vite's `import.meta.env`. */
export interface RuntimeEnv {
  readonly siteUrl: string;
  readonly siteName: string;
  readonly defaultLocale: Locale;
  readonly defaultDirection: Direction;
  readonly contactEmail: string;
  readonly contactWhatsApp: string;
  /** Telegram username without "@". */
  readonly contactTelegram: string;
  readonly bookingProvider: BookingProviderMode;
  readonly calendlyUrl: string | null;
  readonly preplyUrl: string | null;
  readonly analyticsId: string | null;
  readonly isDev: boolean;
  readonly isProd: boolean;
}

type ViteEnv = Record<string, string | boolean | undefined>;

function readString(source: ViteEnv, key: string, fallback = ''): string {
  const raw = source[key];
  return typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : fallback;
}

function readNullableString(source: ViteEnv, key: string): string | null {
  const raw = readString(source, key, '');
  return raw === '' ? null : raw;
}

/**
 * Reads a provider URL, treating unedited template sentinels
 * (e.g. "your-name") as NOT configured, so the app shows a honest
 * fallback state instead of embedding a dead link.
 */
function readConfiguredUrl(source: ViteEnv, key: string): string | null {
  const raw = readNullableString(source, key);
  if (!raw) return null;
  const isPlaceholder = /your-name|example\.com|change-?me|placeholder/i.test(raw);
  return isPlaceholder ? null : raw;
}

function readLocale(source: ViteEnv): Locale {
  const raw = readString(source, 'VITE_DEFAULT_LOCALE', 'en').toLowerCase();
  return raw === 'ar' ? 'ar' : 'en';
}

function readDirection(source: ViteEnv): Direction {
  return readLocale(source) === 'ar' ? 'rtl' : 'ltr';
}

function readBookingMode(source: ViteEnv): BookingProviderMode {
  const raw = readString(source, 'VITE_BOOKING_PROVIDER', 'auto').toLowerCase();
  if (raw === 'calendly' || raw === 'preply' || raw === 'auto') return raw;
  throw new AppError('CONFIG', `Invalid VITE_BOOKING_PROVIDER "${raw}". Use calendly | preply | auto.`);
}

/** Normalize to digits-only international format (wa.me style). */
function normalizeWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 8) {
    throw new AppError('CONFIG', `VITE_CONTACT_WHATSAPP "${raw}" is not a valid phone number.`);
  }
  return digits;
}

function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw new AppError('CONFIG', `VITE_CONTACT_EMAIL "${raw}" is not a valid email address.`);
  }
  return email;
}

/** Strip a leading "@" and validate a Telegram handle. */
function normalizeTelegram(raw: string): string {
  const handle = raw.trim().replace(/^@+/, '');
  if (!/^[A-Za-z0-9_]{4,32}$/.test(handle)) {
    throw new AppError('CONFIG', `VITE_CONTACT_TELEGRAM "${raw}" is not a valid Telegram username.`);
  }
  return handle;
}

export function loadEnv(source: ViteEnv = import.meta.env as ViteEnv): RuntimeEnv {
  return Object.freeze({
    siteUrl: readString(source, 'VITE_SITE_URL', 'http://localhost:5173').replace(/\/$/, ''),
    siteName: readString(source, 'VITE_SITE_NAME', 'Arabic & Quran Teacher'),
    defaultLocale: readLocale(source),
    defaultDirection: readDirection(source),
    contactEmail: normalizeEmail(readString(source, 'VITE_CONTACT_EMAIL', 'teacher@example.com')),
    contactWhatsApp: normalizeWhatsApp(readString(source, 'VITE_CONTACT_WHATSAPP', '201000000000')),
    contactTelegram: normalizeTelegram(readString(source, 'VITE_CONTACT_TELEGRAM', 'Alghoraib')),
    bookingProvider: readBookingMode(source),
    calendlyUrl: readConfiguredUrl(source, 'VITE_CALENDLY_URL'),
    preplyUrl: readConfiguredUrl(source, 'VITE_PREPLY_URL'),
    analyticsId: readNullableString(source, 'VITE_ANALYTICS_ID'),
    isDev: source.DEV === true,
    isProd: source.PROD === true,
  });
}

/** Frozen singleton consumed by app.config and feature modules. */
export const env: RuntimeEnv = loadEnv();
