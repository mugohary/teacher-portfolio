import type { Direction, LocalizedText, Locale } from '../types/shared';

export type TranslationDictionary = Readonly<Record<string, LocalizedText>>;

export interface I18nOptions {
  readonly initialLocale: Locale;
  readonly dictionary: TranslationDictionary;
}

/**
 * Tiny in-house i18n: picks the matching side of every LocalizedText,
 * resolves UI chrome strings from a dictionary, and keeps <html lang/dir>
 * in sync. Broadcasts locale changes so modules can re-render.
 */
export class I18nService {
  private current: Locale;
  private readonly dictionary: TranslationDictionary;
  private readonly listeners = new Set<(locale: Locale) => void>();

  constructor(options: I18nOptions) {
    this.current = options.initialLocale;
    this.dictionary = options.dictionary;
    // Keep methods safe when detached (e.g. array.map(i18n.t)).
    this.t = this.t.bind(this);
    this.translate = this.translate.bind(this);
    this.applyDocumentMetadata();
  }

  /** Active locale (public read access for renderers). */
  get locale(): Locale {
    return this.current;
  }

  getLocale(): Locale {
    return this.current;
  }

  getDirection(): Direction {
    return this.current === 'ar' ? 'rtl' : 'ltr';
  }

  /** Resolve a bilingual text for the active locale. */
  t(text: LocalizedText | string): string {
    if (typeof text === 'string') return text;
    return text[this.current] ?? text.en;
  }

  /** Resolve a UI chrome string by key. */
  translate(key: string): string {
    const entry = this.dictionary[key];
    if (!entry) {
      if (import.meta.env.DEV) console.warn(`[i18n] Missing key: ${key}`);
      return key;
    }
    return this.t(entry);
  }

  setLocale(locale: Locale): void {
    if (locale === this.current) return;
    this.current = locale;
    this.applyDocumentMetadata();
    for (const listener of this.listeners) listener(locale);
  }

  toggleLocale(): void {
    this.setLocale(this.current === 'en' ? 'ar' : 'en');
  }

  onLocaleChange(listener: (locale: Locale) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private applyDocumentMetadata(): void {
    document.documentElement.lang = this.current;
    document.documentElement.dir = this.getDirection();
  }
}
