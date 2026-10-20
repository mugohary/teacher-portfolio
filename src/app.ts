import { appConfig } from '@core/config/app.config';
import { env } from '@core/config/env';
import { errorHandler } from '@core/errors/ErrorHandler';
import { I18nService } from '@core/i18n/I18nService';
import { h, mustQuery } from '@core/utils/dom';
import { isErr } from '@core/utils/result';
import { UI_STRINGS } from '@data/i18n.data';
import { BioModule, StaticBioRepository } from '@modules/bio';
import { BookingModule, BookingStrategyFactory } from '@modules/booking';
import { ContactModule, EnvContactDirectoryRepository } from '@modules/contact';
import { SeoManager, StaticSeoRepository } from '@modules/seo';
import { ServicesModule, StaticServicesRepository } from '@modules/services';
import type { ServiceOffering } from '@modules/services';

/**
 * Composition Root.
 *
 * The only place where concrete repositories, strategies and modules are
 * wired together. Feature modules never import each other — they depend
 * on core contracts and receive collaborators via constructors.
 */
export class App {
  private readonly i18n: I18nService;
  private readonly seo: SeoManager;
  private readonly booking: BookingModule | null;

  constructor() {
    this.i18n = new I18nService({
      initialLocale: App.resolveInitialLocale(),
      dictionary: UI_STRINGS,
    });
    this.seo = new SeoManager(new StaticSeoRepository());

    // Strategy Pattern: resolve the booking provider once at startup.
    const strategyResult = BookingStrategyFactory.create(appConfig.booking, this.i18n);
    this.booking = isErr(strategyResult)
      ? null
      : new BookingModule({ strategy: strategyResult.value, i18n: this.i18n });
  }

  /** ?lang=ar|en wins over the environment default (matches hreflang alternates). */
  private static resolveInitialLocale(): 'en' | 'ar' {
    const param = new URLSearchParams(window.location.search).get('lang');
    return param === 'ar' || param === 'en' ? param : env.defaultLocale;
  }

  async start(): Promise<void> {
    errorHandler.installGlobalListeners();
    await this.seo.applyRoute(window.location.pathname);

    this.renderChrome();
    this.i18n.onLocaleChange(() => this.renderChrome());

    const bookCTA = (): void => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const bio = new BioModule({
      repository: new StaticBioRepository(),
      i18n: this.i18n,
      onBookCTA: bookCTA,
    });

    const services = new ServicesModule({
      repository: new StaticServicesRepository(),
      i18n: this.i18n,
      onBookService: (service: ServiceOffering) => {
        void this.booking?.bookService(service.name.en.toLowerCase().replace(/\s+/g, '-'));
      },
    });

    const contact = new ContactModule({
      repository: new EnvContactDirectoryRepository(),
      i18n: this.i18n,
    });

    await Promise.all([
      bio.mount(mustQuery('#bio-mount')),
      services.mount(mustQuery('#services-mount')),
      this.renderBookingMount(),
      contact.mount(mustQuery('#contact-mount')),
    ]);
  }

  private async renderBookingMount(): Promise<void> {
    const container = mustQuery('#booking-mount');
    if (this.booking) {
      await this.booking.mount(container);
      return;
    }

    // Misconfiguration fallback: never leave a dead section on the page.
    const fallbackLinks = [appConfig.booking.calendlyUrl, appConfig.booking.preplyUrl].filter(
      (url): url is string => Boolean(url),
    );
    const hasProvider = fallbackLinks.length > 0;

    container.replaceChildren(
      h('section', { id: 'booking-panel', className: 'mx-auto max-w-6xl px-6 pb-24 text-center' }, [
        h('h2', {
          id: 'booking',
          className: 'font-display text-3xl font-bold text-sand-100',
          text: this.i18n.translate('section_booking'),
        }),
        hasProvider
          ? h('p', { className: 'mt-3 text-sand-300/75', text: this.i18n.translate('booking_fallback') })
          : h('p', { className: 'mx-auto mt-3 max-w-xl text-sand-300/75', text: this.i18n.translate('booking_coming_soon') }),
        hasProvider
          ? h('div', { className: 'mt-5 flex flex-wrap justify-center gap-3' },
              fallbackLinks.map((url) =>
                h('a', {
                  href: url,
                  attrs: { target: '_blank', rel: 'noopener noreferrer' },
                  className: 'rounded-full border border-gold-400/40 px-6 py-2.5 text-sm text-gold-300 hover:bg-gold-400 hover:text-night-950',
                  text: new URL(url).hostname,
                }),
              ),
            )
          : h('div', { className: 'mt-6 flex flex-wrap justify-center gap-3' }, [
              h('a', {
                href: `${appConfig.contact.whatsappBase}/${appConfig.contact.whatsapp}`,
                attrs: { target: '_blank', rel: 'noopener noreferrer' },
                className: 'rounded-full bg-[#25D366] px-6 py-3 font-display text-sm font-semibold text-night-950 hover:brightness-110',
                text: this.i18n.translate('contact_whatsapp'),
              }),
              h('button', {
                type: 'button',
                className: 'rounded-full bg-gold-400 px-6 py-3 font-display text-sm font-semibold text-night-950 hover:bg-gold-300',
                text: this.i18n.translate('booking_coming_soon_cta'),
                on: {
                  click: () =>
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                },
              }),
            ]),
      ]),
    );
  }

  /** Header + footer chrome, rebuilt on every locale change. */
  private renderChrome(): void {
    const navItems = [
      { href: '#home', key: 'nav_home' as const },
      { href: '#about', key: 'nav_about' as const },
      { href: '#services', key: 'nav_services' as const },
      { href: '#booking', key: 'nav_booking' as const },
      { href: '#contact', key: 'nav_contact' as const },
    ];

    const header = mustQuery('#site-header');
    header.replaceChildren(
      h('div', { className: 'mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4' }, [
        h('a', {
          href: '#home',
          className: 'font-display text-lg font-bold tracking-tight text-sand-100 hover:text-gold-300',
        }, [
          h('span', { className: 'text-gold-400', text: '☾ ' }),
          h('span', { text: appConfig.siteName }),
        ]),
        h('nav', { attrs: { 'aria-label': 'Primary' }, className: 'hidden items-center gap-6 md:flex' },
          navItems.map((item) =>
            h('a', {
              href: item.href,
              className: 'text-sm text-sand-300/80 transition hover:text-gold-300',
              text: this.i18n.translate(item.key),
            }),
          ),
        ),
        h('button', {
          type: 'button',
          attrs: { 'aria-label': 'Switch language' },
          className:
            'rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-sand-100 transition hover:border-gold-400/60 hover:text-gold-300',
          text: this.i18n.translate('nav_toggle_language'),
          on: {
            click: () => {
              this.i18n.toggleLocale();
              // Keep the URL shareable in the active language.
              const url = new URL(window.location.href);
              url.searchParams.set('lang', this.i18n.getLocale());
              window.history.replaceState(null, '', url);
            },
          },
        }),
      ]),
    );

    const footer = mustQuery('#site-footer');
    footer.replaceChildren(
      h('div', { className: 'mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-sand-300/60 sm:flex-row' }, [
        h('p', { text: `© ${appConfig.year} ${appConfig.siteName}. ${this.i18n.translate('footer_rights')}` }),
        h('div', { className: 'flex flex-wrap gap-5' }, [
          h('a', {
            href: `mailto:${appConfig.contact.email}`,
            className: 'hover:text-gold-300',
            text: appConfig.contact.email,
          }),
          h('a', {
            href: `${appConfig.contact.telegramBase}/${appConfig.contact.telegram}`,
            attrs: { target: '_blank', rel: 'noopener noreferrer' },
            className: 'hover:text-gold-300',
            text: `@${appConfig.contact.telegram}`,
          }),
          h('a', {
            href: `${appConfig.contact.whatsappBase}/${appConfig.contact.whatsapp}`,
            attrs: { target: '_blank', rel: 'noopener noreferrer' },
            className: 'hover:text-gold-300',
            text: 'WhatsApp',
          }),
        ]),
      ]),
    );
  }
}
