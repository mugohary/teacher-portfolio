import type { ContactChannelHandler, ContactDirectory } from '../contact.types';
import type { ContactDTO } from '../dto/ContactDTO';

/** WhatsApp deep-link channel — wa.me with an encoded, pre-filled message. */
export class WhatsAppHandler implements ContactChannelHandler {
  readonly id = 'whatsapp' as const;
  readonly label = { en: 'Send via WhatsApp', ar: 'أرسل عبر واتساب' } as const;

  isAvailable(directory: ContactDirectory): boolean {
    return /^\d{8,15}$/.test(directory.whatsapp);
  }

  buildUrl(dto: ContactDTO, directory: ContactDirectory): string {
    const text = encodeURIComponent(dto.toWhatsAppMessage());
    return `${directory.whatsappBase.replace(/\/$/, '')}/${directory.whatsapp}?text=${text}`;
  }

  deliver(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Telegram channel — opens the teacher's chat.
 * (Telegram has no public per-user "prefill message" deep link, so the
 * validated message is copied to the clipboard for easy pasting.)
 */
export class TelegramHandler implements ContactChannelHandler {
  readonly id = 'telegram' as const;
  readonly label = { en: 'Send via Telegram', ar: 'أرسل عبر تيليجرام' } as const;

  isAvailable(directory: ContactDirectory): boolean {
    return /^[A-Za-z0-9_]{4,32}$/.test(directory.telegram);
  }

  buildUrl(_dto: ContactDTO, directory: ContactDirectory): string {
    return `${directory.telegramBase.replace(/\/$/, '')}/${directory.telegram}`;
  }

  deliver(url: string, dto?: ContactDTO): void {
    // Copy the composed message so the visitor can paste it into the chat.
    if (dto && navigator.clipboard) {
      void navigator.clipboard.writeText(dto.toPlainText()).catch(() => undefined);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/** Email channel — mailto: composed from the DTO. */
export class EmailHandler implements ContactChannelHandler {
  readonly id = 'email' as const;
  readonly label = { en: 'Send via Email', ar: 'أرسل عبر البريد' } as const;

  isAvailable(directory: ContactDirectory): boolean {
    return directory.email.includes('@');
  }

  buildUrl(dto: ContactDTO, directory: ContactDirectory): string {
    const { subject, body } = dto.toMailto();
    return `mailto:${directory.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  deliver(url: string): void {
    // mailto: must navigate the current context to survive popup blockers.
    window.location.href = url;
  }
}
