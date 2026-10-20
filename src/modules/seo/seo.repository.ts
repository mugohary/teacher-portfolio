import { StaticReadOnlyRepository } from '@core/repositories/Repository';
import type { SeoMeta, SeoRepository } from './seo.types';
import { SEO_DATABASE } from './seo.data';

/**
 * Repository Pattern: the SEO manager depends on `SeoRepository` only.
 * This static implementation serves the bundled SEO database; replace with
 * a CMS-backed implementation without touching SeoManager.
 */
export class StaticSeoRepository
  extends StaticReadOnlyRepository<SeoMeta>
  implements SeoRepository
{
  constructor(dataset: readonly SeoMeta[] = SEO_DATABASE) {
    super(dataset);
  }

  protected override filter(): readonly SeoMeta[] {
    return this.dataset;
  }

  protected idOf(entity: SeoMeta): string {
    return entity.route;
  }

  protected slugOf(entity: SeoMeta): string {
    return entity.route;
  }

  async findByRoute(route: string): Promise<SeoMeta | null> {
    const normalized = route === '' ? '/' : route;
    return this.dataset.find((meta) => meta.route === normalized) ?? null;
  }
}
