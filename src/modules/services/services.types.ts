import type { Identifiable, LocalizedText } from '@core/types/shared';

export type ServiceCategory = 'arabic' | 'quran' | 'tajweed' | 'kids' | 'islamic';
export type ServiceLevel = 'beginner' | 'intermediate' | 'advanced';
export type ServiceIcon = 'book' | 'quran' | 'star' | 'smile' | 'crescent';

export interface ServiceOffering extends Identifiable {
  readonly category: ServiceCategory;
  readonly name: LocalizedText;
  readonly summary: LocalizedText;
  readonly description: LocalizedText;
  readonly icon: ServiceIcon;
  /** e.g. "30–60 min, flexible" — pricing is private and never rendered. */
  readonly sessionLength: LocalizedText;
  readonly audience?: LocalizedText;
  readonly includes: readonly LocalizedText[];
  readonly levels?: readonly ServiceLevel[];
  readonly featured: boolean;
  readonly badge?: LocalizedText;
}

export interface ServicesQuery {
  readonly category?: ServiceCategory;
  readonly featuredOnly?: boolean;
}

export interface ServicesRepository {
  findAll(query?: ServicesQuery): Promise<readonly ServiceOffering[]>;
  findByCategory(category: ServiceCategory): Promise<readonly ServiceOffering[]>;
}

export const SERVICE_CATEGORY_ORDER: readonly ServiceCategory[] = [
  'arabic',
  'quran',
  'tajweed',
  'kids',
  'islamic',
];

export const SERVICE_CATEGORY_LABELS: Readonly<Record<ServiceCategory, LocalizedText>> = {
  arabic: { en: 'Arabic for English Speakers', ar: 'العربية للناطقين بالإنجليزية' },
  quran: { en: 'Quran Memorization', ar: 'حفظ القرآن الكريم' },
  tajweed: { en: 'Tajweed', ar: 'التجويد' },
  kids: { en: 'Reading Arabic for Kids', ar: 'القراءة العربية للأطفال' },
  islamic: { en: 'Islamic Studies', ar: 'العلوم الإسلامية' },
};

export const SERVICE_LEVEL_LABELS: Readonly<Record<ServiceLevel, LocalizedText>> = {
  beginner: { en: 'Beginner', ar: 'مبتدئ' },
  intermediate: { en: 'Intermediate', ar: 'متوسط' },
  advanced: { en: 'Advanced', ar: 'متقدم' },
};
