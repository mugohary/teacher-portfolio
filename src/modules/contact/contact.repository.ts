import { appConfig } from '@core/config/app.config';
import type { ContactDirectory } from './contact.types';
import { CONTACT_DEFAULTS } from './contact.data';

/** Read model for the contact domain. */
export interface ContactDirectoryRepository {
  getDirectory(): Promise<ContactDirectory>;
}

/**
 * Repository Pattern: resolves contact channels from validated runtime env.
 * Swap for a CMS-backed repository without touching the contact UI.
 */
export class EnvContactDirectoryRepository implements ContactDirectoryRepository {
  async getDirectory(): Promise<ContactDirectory> {
    return Object.freeze({
      email: appConfig.contact.email || CONTACT_DEFAULTS.email,
      whatsapp: appConfig.contact.whatsapp || CONTACT_DEFAULTS.whatsapp,
      whatsappBase: appConfig.contact.whatsappBase,
      telegram: appConfig.contact.telegram || CONTACT_DEFAULTS.telegram,
      telegramBase: appConfig.contact.telegramBase,
      preplyUrl: appConfig.booking.preplyUrl,
    });
  }
}
