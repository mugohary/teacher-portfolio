import type { JsonLdSchema } from '@core/types/shared';
import { appConfig } from '@core/config/app.config';
import type { SeoMeta } from './seo.types';

const SITE_URL = appConfig.siteUrl;
const OG_IMAGE = `${SITE_URL}/assets/images/og-cover.svg`;

/** Person + EducationalOrganization structured data for rich results. */
export function buildTeacherSchema(): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: appConfig.siteName,
    jobTitle: 'Arabic & Quran Teacher',
    url: SITE_URL,
    email: `mailto:${appConfig.contact.email}`,
    knowsLanguage: ['ar', 'en'],
    subjectOf: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Ijazah',
    },
  };
}

export function buildWebSiteSchema(): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: appConfig.siteName,
    url: SITE_URL,
    inLanguage: ['ar', 'en'],
  };
}

export function buildBreadcrumbSchema(): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    ],
  };
}

/** Canonical metadata for the landing route. Additional routes can be appended here. */
export const SEO_DATABASE: readonly SeoMeta[] = Object.freeze([
  Object.freeze({
    route: '/',
    title: `${appConfig.siteName} — Arabic & Quran Lessons Online`,
    description:
      'Ahmed Alghoraib — Arabic for English speakers, Quran memorization, Tajweed and Islamic studies. One-on-one online lessons for ages 6–40. Weekends, 4 PM–3 AM Cairo time.',
    keywords: [
      'arabic for english speakers',
      'quran memorization',
      'tajweed lessons',
      'arabic for kids',
      'islamic studies',
      'online arabic tutor',
      'quran teacher online',
      'learn arabic online',
    ],
    canonicalPath: '/',
    robots: 'index,follow' as const,
    openGraph: {
      title: `${appConfig.siteName} — Arabic & Quran Lessons Online`,
      description:
        'Arabic for English speakers, Quran memorization, Tajweed and Islamic studies — one-on-one online, ages 6–40. Book a lesson with Ahmed Alghoraib.',
      type: 'website' as const,
      siteName: appConfig.siteName,
      locale: 'en_US' as const,
      image: OG_IMAGE,
      imageAlt: `${appConfig.siteName} — Arabic & Quran lessons`,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: appConfig.siteName,
      description: 'Arabic, Quran memorization, Tajweed & Islamic studies — one-on-one online lessons.',
      image: OG_IMAGE,
    },
    alternates: [
      { locale: 'en' as const, href: `${SITE_URL}/` },
      { locale: 'ar' as const, href: `${SITE_URL}/?lang=ar` },
    ],
    jsonLd: [buildTeacherSchema(), buildWebSiteSchema(), buildBreadcrumbSchema()],
  }),
]);
