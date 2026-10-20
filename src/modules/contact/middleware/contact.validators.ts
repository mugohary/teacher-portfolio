import { MiddlewarePipeline } from '@core/middleware/MiddlewarePipeline';
import {
  isEmail,
  maxLength,
  minLength,
  noHtml,
  required,
  trimAllFields,
} from '@core/middleware/matchers';
import type { Middleware } from '@core/middleware/types';
import type { ContactInput } from '../contact.types';
import { CONTACT_SUBJECTS } from '../contact.types';

const SUBJECT_PATTERN = new RegExp(`^(${CONTACT_SUBJECTS.join('|')})$`);

/**
 * Field-scoped middleware chain for the contact form.
 * Order matters: sanitize → presence → format → safety.
 */
export function contactValidationPipeline(): MiddlewarePipeline<ContactInput> {
  const rules: Middleware<ContactInput>[] = [
    trimAllFields<ContactInput>(),
    required('name'),
    minLength('name', 2),
    maxLength('name', 80),
    required('email'),
    isEmail('email'),
    required('subject'),
    // Subject must be one of the known enum values (not free text).
    (() => {
      const validateSubject: Middleware<ContactInput> = (ctx, next) => {
        const value = String(ctx.input.subject ?? '').trim();
        if (value !== '' && !SUBJECT_PATTERN.test(value)) {
          ctx.issues.push({ field: 'subject', rule: 'oneOf', message: 'subject must be a known value.' });
          return;
        }
        next();
      };
      return validateSubject;
    })(),
    required('message'),
    minLength('message', 10),
    maxLength('message', 2000),
    // Trust boundary: reject any HTML/script payloads across all fields.
    noHtml('name', 'email', 'message'),
  ];

  return new MiddlewarePipeline<ContactInput>().use(...rules);
}
