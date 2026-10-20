/**
 * Shared cross-cutting types available to every feature module.
 */

/** Text that exists in both localizations of the site. */
export interface LocalizedText {
  readonly en: string;
  readonly ar: string;
}

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

/** Optional bilingual link (external or in-page anchor). */
export interface LocalizedLink {
  readonly href: string;
  readonly label: LocalizedText;
}

/** Common identity contract for content entities. */
export interface Identifiable {
  readonly id: string;
  readonly slug: string;
}

/** A dated credential/experience entry used by the bio domain. */
export interface DatedEntry extends Identifiable {
  readonly title: LocalizedText;
  readonly issuer?: LocalizedText;
  readonly year: number;
  readonly description?: LocalizedText;
}

/** JSON-LD structured data blob injected by the SEO manager. */
export type JsonLdSchema = Record<string, unknown>;
