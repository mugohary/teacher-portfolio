import { mount } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import { createBookingPanel } from './components/BookingPanel';
import type { BookingOptions, BookingStrategy } from './booking.types';

export interface BookingModuleDeps {
  readonly strategy: BookingStrategy;
  readonly i18n: I18nService;
}

/** Booking feature module — provider-agnostic host for the active strategy. */
export class BookingModule {
  private embedHost: HTMLElement | null = null;
  private currentOptions: Partial<BookingOptions> = {};
  private container: HTMLElement | null = null;

  constructor(private readonly deps: BookingModuleDeps) {
    // Subscribe exactly once — mount() may be called repeatedly.
    deps.i18n.onLocaleChange(() => {
      if (this.container) void this.mount(this.container);
    });
  }

  async mount(container: HTMLElement): Promise<void> {
    this.container = container;
    this.embedHost = document.createElement('div');
    this.embedHost.id = 'booking-embed';
    this.embedHost.className = 'min-h-[24rem]';

    mount(container, createBookingPanel(this.deps.strategy, this.deps.i18n, this.embedHost));
    await this.renderStrategy();
  }

  /** Re-render the embed with a service pre-selected, then scroll into view. */
  async bookService(serviceSlug: string): Promise<void> {
    this.currentOptions = { ...this.currentOptions, preselectedService: serviceSlug };
    await this.renderStrategy();
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private async renderStrategy(): Promise<void> {
    if (!this.embedHost) return;
    const options: Partial<BookingOptions> = {
      locale: this.deps.i18n.getLocale(),
      ...this.currentOptions,
    };
    await this.deps.strategy.mount(this.embedHost, options);
  }
}
