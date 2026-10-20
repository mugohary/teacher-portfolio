import { h } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import type { ValidationIssue } from '@core/errors/AppError';
import { UI_STRINGS, type UIStringKey } from '@data/i18n.data';
import type { ContactChannelHandler, ContactDirectory } from '../contact.types';
import { CONTACT_SUBJECTS, SUBJECT_LABELS } from '../contact.types';
import { ContactDTO } from '../dto/ContactDTO';

const RULE_MESSAGE_KEYS: Readonly<Record<string, UIStringKey>> = {
  required: 'error_required',
  email: 'error_email',
  minLength: 'error_minLength',
  maxLength: 'error_maxLength',
  noHtml: 'error_noHtml',
  oneOf: 'error_generic',
  pattern: 'error_generic',
};

export interface ContactFormOptions {
  readonly i18n: I18nService;
  readonly directory: ContactDirectory;
  readonly handlers: readonly ContactChannelHandler[];
}

const FIELD_CLASS =
  'w-full rounded-xl border border-white/10 bg-night-800/60 px-4 py-3 text-sm text-sand-100 placeholder:text-sand-300/40 transition focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/50 focus:outline-none';

function fieldErrorNode(id: string): HTMLElement {
  return h('p', { id, className: 'mt-1.5 min-h-4 text-xs text-amber-300/90', attrs: { 'aria-live': 'polite' } });
}

function applyIssues(issues: readonly ValidationIssue[], locale: 'en' | 'ar'): Map<string, string> {
  const byField = new Map<string, string>();
  for (const issue of issues) {
    if (byField.has(issue.field)) continue;
    const key = RULE_MESSAGE_KEYS[issue.rule] ?? 'error_generic';
    byField.set(issue.field, UI_STRINGS[key][locale]);
  }
  return byField;
}

/** Success state: hand the validated message to the visitor's channel of choice. */
function createChannelChooser(
  dto: ContactDTO,
  options: ContactFormOptions,
  onReset: () => void,
): HTMLElement {
  const { i18n, directory, handlers } = options;
  const available = handlers.filter((handler) => handler.isAvailable(directory));

  return h('div', {
    attrs: { role: 'status' },
    className: 'rounded-2xl border border-teal-400/30 bg-teal-400/5 p-8 text-center',
  }, [
    h('p', { className: 'font-display text-lg font-semibold text-sand-100', text: i18n.translate('contact_success') }),
    h('p', { className: 'mt-1 text-sm text-sand-300/70', text: `${dto.name} · ${dto.subjectLabel}` }),
    h('div', { className: 'mt-6 flex flex-wrap justify-center gap-3' },
      available.map((handler) =>
        h('button', {
          type: 'button',
          className: [
            'rounded-full px-6 py-3 font-display text-sm font-semibold text-night-950 transition',
            handler.id === 'whatsapp'
              ? 'bg-[#25D366] hover:brightness-110'
              : handler.id === 'telegram'
                ? 'bg-[#2AABEE] hover:brightness-110'
                : 'bg-gold-400 hover:bg-gold-300',
          ].join(' '),
          text: i18n.t(handler.label),
          on: {
            click: () => handler.deliver(handler.buildUrl(dto, directory), dto),
          },
        }),
      ),
    ),
    h('button', {
      type: 'button',
      className: 'mt-6 text-sm text-sand-300/60 underline underline-offset-4 hover:text-gold-300',
      text: i18n.locale === 'ar' ? 'إرسال رسالة أخرى' : 'Write another message',
      on: { click: onReset },
    }),
  ]);
}

/** Contact form with middleware-validated DTO submission. */
export function createContactForm(options: ContactFormOptions): HTMLElement {
  const { i18n } = options;
  const host = h('div', { id: 'contact-form-host' });

  const build = (): HTMLElement => {
    const nameError = fieldErrorNode('contact-name-error');
    const emailError = fieldErrorNode('contact-email-error');
    const subjectError = fieldErrorNode('contact-subject-error');
    const messageError = fieldErrorNode('contact-message-error');

    const nameInput = h('input', {
      id: 'contact-name',
      className: FIELD_CLASS,
      attrs: { name: 'name', type: 'text', autocomplete: 'name', required: true, placeholder: 'John Doe', 'aria-describedby': 'contact-name-error' },
    });
    const emailInput = h('input', {
      id: 'contact-email',
      className: FIELD_CLASS,
      attrs: { name: 'email', type: 'email', autocomplete: 'email', required: true, placeholder: 'you@example.com', 'aria-describedby': 'contact-email-error' },
    });
    const subjectSelect = h('select', {
      id: 'contact-subject',
      className: FIELD_CLASS,
      attrs: { name: 'subject', required: true, 'aria-describedby': 'contact-subject-error' },
    }, CONTACT_SUBJECTS.map((subject) =>
      h('option', { attrs: { value: subject }, text: i18n.t(SUBJECT_LABELS[subject]) }),
    ));
    const messageTextarea = h('textarea', {
      id: 'contact-message',
      className: `${FIELD_CLASS} min-h-36 resize-y`,
      attrs: { name: 'message', rows: 5, required: true, placeholder: i18n.locale === 'ar' ? 'اكتب رسالتك هنا…' : 'Tell me about your goals…', 'aria-describedby': 'contact-message-error' },
    });

    const submitButton = h('button', {
      type: 'submit',
      className:
        'w-full rounded-xl bg-gold-400 py-3 font-display text-sm font-semibold text-night-950 transition hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950 focus-visible:outline-none sm:w-auto sm:px-10',
      text: i18n.translate('contact_submit'),
    });

    const clearErrors = (): void => {
      for (const errorNode of [nameError, emailError, subjectError, messageError]) errorNode.textContent = '';
      for (const field of [nameInput, emailInput, subjectSelect, messageTextarea]) field.removeAttribute('aria-invalid');
    };

    const form = h('form', {
      attrs: { novalidate: true, 'aria-label': i18n.translate('section_contact') },
      className: 'space-y-5',
      on: {
        submit: (event) => {
          event.preventDefault();
          void (async () => {
            clearErrors();
            const data = new FormData(form);
            const dtoResult = await ContactDTO.from(Object.fromEntries(data.entries()), i18n.getLocale());

            if (!dtoResult.ok) {
              const byField = applyIssues(dtoResult.error.issues, i18n.getLocale());
              const map: [HTMLElement, HTMLElement, string][] = [
                [nameInput, nameError, 'name'],
                [emailInput, emailError, 'email'],
                [subjectSelect, subjectError, 'subject'],
                [messageTextarea, messageError, 'message'],
              ];
              for (const [field, errorNode, fieldName] of map) {
                const message = byField.get(fieldName);
                if (message) {
                  errorNode.textContent = message;
                  field.setAttribute('aria-invalid', 'true');
                }
              }
              const firstInvalid = map.find(([, , fieldName]) => byField.has(fieldName));
              firstInvalid?.[0].focus();
              return;
            }

            host.replaceChildren(createChannelChooser(dtoResult.value, options, () => {
              host.replaceChildren(build());
            }));
          })();
        },
      },
    }, [
      h('div', { className: 'grid gap-5 sm:grid-cols-2' }, [
        h('div', {}, [
          h('label', { className: 'mb-1.5 block text-xs font-medium tracking-wide text-sand-300/70', attrs: { for: 'contact-name' }, text: i18n.translate('contact_name') }),
          nameInput,
          nameError,
        ]),
        h('div', {}, [
          h('label', { className: 'mb-1.5 block text-xs font-medium tracking-wide text-sand-300/70', attrs: { for: 'contact-email' }, text: i18n.translate('contact_email') }),
          emailInput,
          emailError,
        ]),
      ]),
      h('div', {}, [
        h('label', { className: 'mb-1.5 block text-xs font-medium tracking-wide text-sand-300/70', attrs: { for: 'contact-subject' }, text: i18n.translate('contact_subject') }),
        subjectSelect,
        subjectError,
      ]),
      h('div', {}, [
        h('label', { className: 'mb-1.5 block text-xs font-medium tracking-wide text-sand-300/70', attrs: { for: 'contact-message' }, text: i18n.translate('contact_message') }),
        messageTextarea,
        messageError,
      ]),
      h('div', { className: 'flex flex-col items-start gap-4 sm:flex-row sm:items-center' }, [
        submitButton,
        h('a', {
          href: `${options.directory.whatsappBase.replace(/\/$/, '')}/${options.directory.whatsapp}`,
          attrs: { target: '_blank', rel: 'noopener noreferrer' },
          className: 'text-sm font-medium text-[#25D366] underline-offset-4 hover:underline',
          text: i18n.translate('contact_whatsapp'),
        }),
      ]),
    ]);

    return form;
  };

  host.append(build());
  return host;
}
