import type { JsonLdSchema, Locale } from '@core/types/shared';

export type RobotsPolicy = 'index,follow' | 'noindex,nofollow';
export type OpenGraphType = 'website' | 'profile' | 'article';
export type TwitterCardType = 'summary' | 'summary_large_image';

/** Open Graph bundle (Facebook / WhatsApp / Telegram previews). */
export interface OpenGraphMeta {
  readonly title: string;
  readonly description: string;
  readonly type: OpenGraphType;
  readonly siteName: string;
  readonly locale: 'en_US' | 'ar_AR';
  /** Absolute URL — resolved against VITE_SITE_URL when relative. */
  readonly image?: string;
  readonly imageAlt?: string;
}

export interface TwitterMeta {
  readonly card: TwitterCardType;
  readonly title: string;
  readonly description: string;
  readonly image?: string;
}

/** hreflang alternate for bilingual SEO. */
export interface LocaleAlternate {
  readonly locale: Locale;
  readonly href: string;
}

/** Fully resolved metadata document for a single route. */
export interface SeoMeta {
  /** Route key, e.g. "/" or "/services". */
  readonly route: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly canonicalPath: string;
  readonly robots: RobotsPolicy;
  readonly openGraph: OpenGraphMeta;
  readonly twitter: TwitterMeta;
  readonly alternates: readonly LocaleAlternate[];
  readonly jsonLd: readonly JsonLdSchema[];
}

export interface SeoRepository {
  findByRoute(route: string): Promise<SeoMeta | null>;
  findAll(): Promise<readonly SeoMeta[]>;
}
