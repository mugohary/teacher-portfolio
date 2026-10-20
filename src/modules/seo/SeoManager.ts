import type { JsonLdSchema } from '@core/types/shared';
import type { SeoMeta, SeoRepository } from './seo.types';

const JSON_LD_TYPE = 'application/ld+json';

/**
 * SEO & Meta Configuration Manager.
 *
 * Owns every runtime mutation of <head>: title, description, keywords,
 * canonical, robots, Open Graph, Twitter cards, hreflang alternates and
 * JSON-LD structured data. Idempotent — re-applying a meta document
 * updates existing tags instead of duplicating them.
 */
export class SeoManager {
  constructor(private readonly repository: SeoRepository) {}

  /** Apply the metadata document attached to a route. Falls back to "/". */
  async applyRoute(route: string): Promise<void> {
    const meta = (await this.repository.findByRoute(route)) ?? (await this.repository.findByRoute('/'));
    if (!meta) return;
    this.apply(meta);
  }

  apply(meta: SeoMeta): void {
    document.title = meta.title;

    this.upsertTag('meta[name="description"]', { name: 'description', content: meta.description });
    this.upsertTag('meta[name="keywords"]', {
      name: 'keywords',
      content: meta.keywords.join(', '),
    });
    this.upsertTag('meta[name="robots"]', { name: 'robots', content: meta.robots });

    this.upsertTag('meta[property="og:title"]', { property: 'og:title', content: meta.openGraph.title });
    this.upsertTag('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.openGraph.description,
    });
    this.upsertTag('meta[property="og:type"]', { property: 'og:type', content: meta.openGraph.type });
    this.upsertTag('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: meta.openGraph.siteName,
    });
    this.upsertTag('meta[property="og:locale"]', { property: 'og:locale', content: meta.openGraph.locale });
    if (meta.openGraph.image) {
      this.upsertTag('meta[property="og:image"]', { property: 'og:image', content: meta.openGraph.image });
      this.upsertTag('meta[property="og:image:alt"]', {
        property: 'og:image:alt',
        content: meta.openGraph.imageAlt ?? meta.openGraph.title,
      });
    }

    this.upsertTag('meta[name="twitter:card"]', { name: 'twitter:card', content: meta.twitter.card });
    this.upsertTag('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.twitter.title });
    this.upsertTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.twitter.description,
    });
    if (meta.twitter.image) {
      this.upsertTag('meta[name="twitter:image"]', { name: 'twitter:image', content: meta.twitter.image });
    }

    this.applyCanonical(meta.canonicalPath);
    this.applyAlternates(meta.alternates);

    for (const schema of meta.jsonLd) this.injectJsonLd(schema);
  }

  /** Inject (or replace) a JSON-LD graph node keyed by @type. */
  injectJsonLd(schema: JsonLdSchema): void {
    const type = typeof schema['@type'] === 'string' ? (schema['@type'] as string) : 'default';
    const id = `json-ld-${type.toLowerCase()}`;
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = JSON_LD_TYPE;
      script.id = id;
      script.setAttribute('data-json-ld', type);
      document.head.append(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  private applyCanonical(path: string): void {
    const href = path.startsWith('http') ? path : `${new URL(import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173', window.location.origin)}${path.startsWith('/') ? path : `/${path}`}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.append(link);
    }
    link.href = href;
  }

  private applyAlternates(alternates: readonly { locale: string; href: string }[]): void {
    document.querySelectorAll<HTMLLinkElement>('link[data-alternate]').forEach((node) => node.remove());
    for (const alternate of alternates) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alternate.locale;
      link.href = alternate.href;
      link.setAttribute('data-alternate', '');
      document.head.append(link);
    }
  }

  private upsertTag(
    selector: string,
    attributes: Record<string, string>,
  ): void {
    let tag = document.head.querySelector<HTMLElement>(selector);
    if (!tag) {
      tag = document.createElement('meta');
      document.head.append(tag);
    }
    for (const [key, value] of Object.entries(attributes)) tag.setAttribute(key, value);
  }
}
