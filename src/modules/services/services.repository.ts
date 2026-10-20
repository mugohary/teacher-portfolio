import { StaticReadOnlyRepository } from '@core/repositories/Repository';
import { SERVICE_CATALOG } from './services.data';
import type {
  ServiceCategory,
  ServiceOffering,
  ServicesQuery,
  ServicesRepository,
} from './services.types';

/** Repository Pattern: queryable catalog with a swappable backing store. */
export class StaticServicesRepository
  extends StaticReadOnlyRepository<ServiceOffering, ServicesQuery>
  implements ServicesRepository
{
  constructor(dataset: readonly ServiceOffering[] = SERVICE_CATALOG) {
    super(dataset);
  }

  override async findAll(query?: ServicesQuery): Promise<readonly ServiceOffering[]> {
    return this.filter(query);
  }

  async findByCategory(category: ServiceCategory): Promise<readonly ServiceOffering[]> {
    return this.dataset.filter((service) => service.category === category);
  }

  protected override filter(query?: ServicesQuery): readonly ServiceOffering[] {
    let result = this.dataset;
    if (query?.category) {
      result = result.filter((service) => service.category === query.category);
    }
    if (query?.featuredOnly) {
      result = result.filter((service) => service.featured);
    }
    return result;
  }

  protected idOf(entity: ServiceOffering): string {
    return entity.id;
  }

  protected slugOf(entity: ServiceOffering): string {
    return entity.slug;
  }
}
