export * from './contact.types';
export { ContactModule, type ContactModuleDeps } from './ContactModule';
export { ContactDTO } from './dto/ContactDTO';
export { EnvContactDirectoryRepository, type ContactDirectoryRepository } from './contact.repository';
export { WhatsAppHandler, TelegramHandler, EmailHandler } from './handlers/ContactHandlers';
export { contactValidationPipeline } from './middleware/contact.validators';
export { createContactForm } from './components/ContactForm';
export { SUBJECT_LABELS, CONTACT_SUBJECTS } from './contact.types';
