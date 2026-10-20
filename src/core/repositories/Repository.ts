/**
 * Repository Pattern — persistence-agnostic contracts.
 *
 * Feature modules depend only on these interfaces; the concrete
 * implementations (static data today, headless CMS / REST later) are
 * injected at composition time in `src/app.ts`.
 */

/** Read-side contract for content aggregates. */
export interface ReadOnlyRepository<TEntity, TQuery = undefined> {
  findAll(query?: TQuery): Promise<readonly TEntity[]>;
  findBySlug(slug: string): Promise<TEntity | null>;
  findById(id: string): Promise<TEntity | null>;
}

/** Write-side contract, implemented only where mutation is meaningful. */
export interface WriteRepository<TEntity, TCreate, TUpdate> {
  create(input: TCreate): Promise<TEntity>;
  update(id: string, patch: TUpdate): Promise<TEntity>;
  delete(id: string): Promise<void>;
}

export type Repository<TEntity, TQuery = undefined> = ReadOnlyRepository<TEntity, TQuery> &
  Partial<WriteRepository<TEntity, unknown, unknown>>;

/**
 * In-memory implementation backed by a static dataset.
 * Keeps the async surface so swapping in a network-backed
 * repository requires zero changes in consuming modules.
 */
export abstract class StaticReadOnlyRepository<TEntity, TQuery = undefined>
  implements ReadOnlyRepository<TEntity, TQuery>
{
  protected constructor(protected readonly dataset: readonly TEntity[]) {}

  async findAll(query?: TQuery): Promise<readonly TEntity[]> {
    return this.filter(query);
  }

  async findBySlug(slug: string): Promise<TEntity | null> {
    return this.dataset.find((entity) => this.slugOf(entity) === slug) ?? null;
  }

  async findById(id: string): Promise<TEntity | null> {
    return this.dataset.find((entity) => this.idOf(entity) === id) ?? null;
  }

  /** Hook for subclasses to apply domain-specific filtering. */
  protected filter(_query?: TQuery): readonly TEntity[] {
    return this.dataset;
  }

  protected abstract idOf(entity: TEntity): string;
  protected abstract slugOf(entity: TEntity): string;
}
