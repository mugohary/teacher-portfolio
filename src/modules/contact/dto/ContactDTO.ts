import type { Locale } from '@core/types/shared';
import { ok } from '@core/utils/result';
import { validationFailure, type ValidationResult } from '@core/errors/AppError';
import type { ContactInput, ContactSubject } from '../contact.types';
import { SUBJECT_LABELS } from '../contact.types';
import { contactValidationPipeline } from '../middleware/contact.validators';

/**
 * Data Transfer Object — the only shape that leaves the contact trust
 * boundary. Construction is private; `ContactDTO.from()` is the single
 * entry point and runs the middleware validation pipeline.
 */
export class ContactDTO {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly subject: ContactSubject,
    public readonly message: string,
    public readonly preferredLanguage: Locale,
    public readonly submittedAt: Readonly<Date>,
  ) {}

  /** Parse untrusted input → validated DTO (or collected validation issues). */
  static async from(raw: unknown, preferredLanguage: Locale = 'en'): Promise<ValidationResult<ContactDTO>> {
    const input = ContactDTO.toInput(raw);
    const outcome = await contactValidationPipeline().run(input);
    if (!outcome.ok) return validationFailure(outcome.issues);

    return ok(
      new ContactDTO(
        outcome.value.name,
        outcome.value.email,
        outcome.value.subject as ContactSubject,
        outcome.value.message,
        preferredLanguage,
        new Date(),
      ),
    );
  }

  private static toInput(raw: unknown): ContactInput {
    const record: Record<string, unknown> =
      raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    const read = (key: string): string => (typeof record[key] === 'string' ? (record[key] as string) : '');
    return {
      name: read('name'),
      email: read('email'),
      subject: read('subject'),
      message: read('message'),
    };
  }

  /** Localized subject label for the active language. */
  get subjectLabel(): string {
    return SUBJECT_LABELS[this.subject][this.preferredLanguage];
  }

  /** Plain-text body shared by every delivery channel. */
  toPlainText(): string {
    return [
      `Name: ${this.name}`,
      `Email: ${this.email}`,
      `Subject: ${this.subjectLabel}`,
      `Language: ${this.preferredLanguage.toUpperCase()}`,
      `Submitted: ${this.submittedAt.toISOString()}`,
      '',
      this.message,
    ].join('\n');
  }

  /** WhatsApp-flavored message (wa.me `text` parameter). */
  toWhatsAppMessage(): string {
    const greeting =
      this.preferredLanguage === 'ar'
        ? `السلام عليكم، أنا ${this.name} بخصوص: ${this.subjectLabel}.`
        : `Hello, I'm ${this.name} regarding: ${this.subjectLabel}.`;
    return `${greeting}\n\n${this.message}\n\n(${this.email})`;
  }

  /** mailto: subject/body pair. */
  toMailto(): { subject: string; body: string } {
    return {
      subject: `[${this.subjectLabel}] ${this.name}`,
      body: this.toPlainText(),
    };
  }
}
