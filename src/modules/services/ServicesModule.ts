import { h, mount } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import { createServiceCard } from './components/ServiceCard';
import type {
  ServiceCategory,
  ServiceOffering,
  ServicesRepository,
} from './services.types';
import { SERVICE_CATEGORY_LABELS, SERVICE_CATEGORY_ORDER } from './services.types';

export interface ServicesModuleDeps {
  readonly repository: ServicesRepository;
  readonly i18n: I18nService;
  readonly onBookService: (service: ServiceOffering) => void;
}

type Filter = ServiceCategory | 'all';

/** Services feature module: filterable catalog grid. */
export class ServicesModule {
  private activeFilter: Filter = 'all';
  private container: HTMLElement | null = null;

  constructor(private readonly deps: ServicesModuleDeps) {
    // Subscribe exactly once — mount() may be called repeatedly.
    deps.i18n.onLocaleChange(() => void this.render());
  }

  async mount(container: HTMLElement): Promise<void> {
    this.container = container;
    await this.render();
  }

  private async render(): Promise<void> {
    if (!this.container) return;

    const { repository, i18n } = this.deps;
    const query = this.activeFilter === 'all' ? undefined : { category: this.activeFilter };
    const services = await repository.findAll(query);

    const heading = h('div', { className: 'mb-10 max-w-2xl' }, [
      h('h2', {
        id: 'services',
        className: 'font-display text-3xl font-bold text-sand-100 md:text-4xl',
        text: i18n.translate('section_services'),
      }),
      h('p', {
        className: 'mt-3 text-sand-300/75',
        text: i18n.locale === 'ar'
          ? 'اختر المسار الذي يناسب هدفك — كل الحصص فردية مباشرة عبر الإنترنت (وحصص جماعية عبر زوم عند الرغبة).'
          : 'Choose the track that matches your goal — every lesson is live and one-on-one (group classes on Zoom when preferred).',
      }),
    ]);

    const filters = h('div', { attrs: { role: 'tablist', 'aria-label': 'Service filters' }, className: 'mb-8 flex flex-wrap gap-2' },
      (['all', ...SERVICE_CATEGORY_ORDER] as const).map((filter) => {
        const isActive = this.activeFilter === filter;
        const label =
          filter === 'all'
            ? i18n.locale === 'ar'
              ? 'الكل'
              : 'All'
            : i18n.t(SERVICE_CATEGORY_LABELS[filter]);

        return h('button', {
          type: 'button',
          role: 'tab',
          attrs: { 'aria-selected': isActive },
          className: [
            'rounded-full px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:outline-none',
            isActive
              ? 'bg-gold-400 text-night-950'
              : 'border border-white/10 bg-white/5 text-sand-300/80 hover:border-gold-400/40 hover:text-gold-300',
          ].join(' '),
          text: label,
          on: {
            click: () => {
              this.activeFilter = filter;
              void this.render();
            },
          },
        });
      }),
    );

    const grid = h('div', { className: 'grid gap-6 md:grid-cols-2 xl:grid-cols-2' },
      services.length > 0
        ? services.map((service) => createServiceCard(service, this.deps.i18n, { onBook: this.deps.onBookService }))
        : [h('p', { className: 'text-sand-300/70', text: i18n.locale === 'ar' ? 'لا توجد خدمات مطابقة.' : 'No services match this filter.' })],
    );

    mount(this.container, h('section', { id: 'services-panel', className: 'mx-auto max-w-6xl px-6 pb-24' }, [heading, filters, grid]));
  }
}
