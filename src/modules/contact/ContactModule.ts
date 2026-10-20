import { h, mount } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import { createContactForm } from './components/ContactForm';
import type { ContactChannelHandler, ContactDirectory } from './contact.types';
import { EmailHandler, TelegramHandler, WhatsAppHandler } from './handlers/ContactHandlers';
import type { ContactDirectoryRepository } from './contact.repository';

export interface ContactModuleDeps {
  readonly repository: ContactDirectoryRepository;
  readonly i18n: I18nService;
  /** Extra delivery channels (defaults to WhatsApp + Email). */
  readonly handlers?: readonly ContactChannelHandler[];
}

/** Contact feature module: form + validated DTO + delivery channel chooser. */
export class ContactModule {
  private container: HTMLElement | null = null;
  private directory: ContactDirectory | null = null;

  constructor(private readonly deps: ContactModuleDeps) {
    // Subscribe exactly once — mount() may be called repeatedly.
    deps.i18n.onLocaleChange(() => void this.render());
  }

  async mount(container: HTMLElement): Promise<void> {
    this.container = container;
    this.directory = await this.deps.repository.getDirectory();
    await this.render();
  }

  private async render(): Promise<void> {
    if (!this.container || !this.directory) return;

    const { i18n } = this.deps;
    const handlers = this.deps.handlers ?? [new WhatsAppHandler(), new TelegramHandler(), new EmailHandler()];
    const directory = this.directory;

    // All four public channels, always visible.
    const directChips: { label: string; href: string; accent: string }[] = [
      {
        label: directory.email,
        href: `mailto:${directory.email}`,
        accent: 'border-gold-400/30 text-gold-300 hover:bg-gold-400/10',
      },
      {
        label: i18n.locale === 'ar' ? `تيليجرام @${directory.telegram}` : `Telegram @${directory.telegram}`,
        href: `${directory.telegramBase.replace(/\/$/, '')}/${directory.telegram}`,
        accent: 'border-[#2AABEE]/40 text-[#2AABEE] hover:bg-[#2AABEE]/10',
      },
      {
        label: i18n.translate('contact_whatsapp'),
        href: `${directory.whatsappBase.replace(/\/$/, '')}/${directory.whatsapp}`,
        accent: 'border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10',
      },
      ...(directory.preplyUrl
        ? [
            {
              label: i18n.translate('contact_preply'),
              href: directory.preplyUrl,
              accent: 'border-teal-400/40 text-teal-300 hover:bg-teal-400/10',
            },
          ]
        : []),
    ];

    mount(
      this.container,
      h('section', { id: 'contact-panel', className: 'mx-auto max-w-3xl px-6 pb-24' }, [
        h('div', { className: 'mb-8 text-center' }, [
          h('h2', {
            id: 'contact',
            className: 'font-display text-3xl font-bold text-sand-100 md:text-4xl',
            text: i18n.translate('section_contact'),
          }),
          h('p', {
            className: 'mt-3 text-sand-300/75',
            text: i18n.locale === 'ar'
              ? 'أخبرني عن هدفك ومستواك، وسأقترح عليك خطة مناسبة — أو تواصل مباشرة عبر إحدى القنوات.'
              : 'Tell me about your goal and level and I will suggest a plan — or reach out directly on any channel.',
          }),
          h('div', { className: 'mt-5 flex flex-wrap items-center justify-center gap-2.5' }, [
            h('span', { className: 'me-1 text-[11px] tracking-wider text-sand-300/50 uppercase', text: i18n.translate('contact_direct') }),
            ...directChips.map((chip) =>
              h('a', {
                href: chip.href,
                attrs: { target: '_blank', rel: 'noopener noreferrer' },
                className: `rounded-full border px-4 py-1.5 text-xs font-medium transition ${chip.accent}`,
                text: chip.label,
              }),
            ),
          ]),
        ]),
        h('div', {
          className: 'rounded-2xl border border-white/10 bg-night-800/40 p-6 backdrop-blur-sm md:p-8',
        }, [createContactForm({ i18n, directory, handlers })]),
      ]),
    );
  }
}
