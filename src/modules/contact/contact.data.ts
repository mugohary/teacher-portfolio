import type { ContactDirectory } from './contact.types';

/** Contact domain defaults — overridden by the env-backed repository. */
export const CONTACT_DEFAULTS: ContactDirectory = Object.freeze({
  email: 'teacher@example.com',
  whatsapp: '201000000000',
  whatsappBase: 'https://wa.me',
  telegram: 'Alghoraib',
  telegramBase: 'https://t.me',
  preplyUrl: null,
});
