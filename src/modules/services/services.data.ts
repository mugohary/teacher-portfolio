import type { ServiceOffering } from './services.types';

/**
 * Catalog of teachable services — content only, never pricing.
 * Private pricing is discussed directly with the student.
 */
export const SERVICE_CATALOG: readonly ServiceOffering[] = Object.freeze([
  Object.freeze({
    id: 'svc-arabic-01',
    slug: 'arabic-for-english-speakers',
    category: 'arabic' as const,
    icon: 'book' as const,
    name: { en: 'Arabic for English Speakers', ar: 'العربية للناطقين بالإنجليزية' },
    summary: {
      en: 'A warm-up conversation, then Al-Arabiyyah Bayna Yadayk — at your pace, in your balance of Arabic and English.',
      ar: 'محادثة تهيئة، ثم كتاب العربية بين يديك — بإيقاعك وتوازنك بين العربية والإنجليزية.',
    },
    description: {
      en: 'Built for English-proficient learners of any age (6–40). Every session starts with conversation, continues through the Al-Arabiyyah Bayna Yadayk curriculum, and stays flexible in pace, style and materials.',
      ar: 'مصمّمة لمتعلمي الإنجليزية من أي عمر (٦–٤٠). تبدأ كل حصة بمحادثة، ثم تواصل عبر منهج العربية بين يديك، وتبقى مرنة في الإيقاع والأسلوب والمواد.',
    },
    sessionLength: { en: '30–60 min · flexible', ar: '٣٠–٦٠ دقيقة · مرنة' },
    audience: { en: 'Ages 6–40 · all levels', ar: 'من ٦–٤٠ سنة · كل المستويات' },
    includes: [
      { en: 'Warm-up conversation every session', ar: 'محادثة تهيئة في كل حصة' },
      { en: 'Al-Arabiyyah Bayna Yadayk curriculum', ar: 'منهج العربية بين يديك' },
      { en: 'Flexible pace, style & materials', ar: 'إيقاع وأسلوب ومواد مرنة' },
      { en: 'Adjustable Arabic ↔ English balance', ar: 'توازن قابل للتعديل بين العربية والإنجليزية' },
    ],
    featured: true,
    badge: { en: 'Core course', ar: 'المسار الأساسي' },
  }),
  Object.freeze({
    id: 'svc-quran-01',
    slug: 'quran-memorization-techniques',
    category: 'quran' as const,
    icon: 'quran' as const,
    name: { en: 'Quran Memorization Techniques', ar: 'تقنيات حفظ القرآن الكريم' },
    summary: {
      en: 'Review, correct, recite new portions, repeat what is hard — then a fresh surah or ayah is assigned each session.',
      ar: 'مراجعة، وتصحيح، وتلاوة نصيب جديد، وتكبير ما يصعب — ثم تُسند سورة أو آية جديدة في كل حصة.',
    },
    description: {
      en: 'A structured memorization loop: old portions reviewed, past mistakes corrected, a new portion recited, difficult ayahs repeated until solid, and a new assignment given at the end.',
      ar: 'حلقة حفظ منظّمة: مراجعة النصوص السابقة، وتصحيح الأخطاء، وتلاوة نصيب جديد، وتكرار الآيات الصعبة حتى ترسخ، ثم إسناد واجب جديد في الختام.',
    },
    sessionLength: { en: '30–60 min · flexible', ar: '٣٠–٦٠ دقيقة · مرنة' },
    audience: { en: 'Ages 6–40 · any portion', ar: 'من ٦–٤٠ سنة · أي نصيب' },
    includes: [
      { en: 'Review of previously memorized portions', ar: 'مراجعة الحفظ السابق' },
      { en: 'Correction of past mistakes', ar: 'تصحيح الأخطاء السابقة' },
      { en: 'New portion recited & repeated until solid', ar: 'نصيب جديد يُتلى ويُكرَّر حتى يرسخ' },
      { en: 'New surah / ayah assigned each session', ar: 'إيصال سورة أو آية جديدة كل حصة' },
    ],
    featured: true,
    badge: { en: 'Most requested', ar: 'الأكثر طلبًا' },
  }),
  Object.freeze({
    id: 'svc-tajweed-01',
    slug: 'tajweed-all-levels',
    category: 'tajweed' as const,
    icon: 'star' as const,
    name: { en: 'Tajweed', ar: 'التجويد' },
    summary: {
      en: 'Beginner, intermediate and advanced — as a separate theory slot or alongside your memorization.',
      ar: 'مبتدئ ومتوسط ومتقدم — كموضع نظري منفصل أو مع الحفظ في نفس الوقت.',
    },
    description: {
      en: 'Theory explained and then drilled directly on your own recitation. Take Tajweed as its own session or weave it into memorization sessions, whichever suits you.',
      ar: 'أحكام تُشرح ثم تُدرَّب مباشرة على تلاوتك. خذ التجويد حصة منفصلة أو ادمجه مع الحفظ، كما يناسبك.',
    },
    sessionLength: { en: '30–60 min · flexible', ar: '٣٠–٦٠ دقيقة · مرنة' },
    audience: { en: 'Beginner → advanced', ar: 'مبتدئ ← متقدم' },
    includes: [
      { en: 'Separate theory slot or combined with memorization', ar: 'موضع نظري منفصل أو مع الحفظ' },
      { en: 'Rules drilled on your own recitation', ar: 'أحكام تُدرَّب على تلاوتك أنت' },
      { en: 'Beginner, intermediate & advanced levels', ar: 'مستويات: مبتدئ ومتوسط ومتقدم' },
    ],
    levels: ['beginner', 'intermediate', 'advanced'] as const,
    featured: false,
  }),
  Object.freeze({
    id: 'svc-kids-01',
    slug: 'reading-arabic-for-kids',
    category: 'kids' as const,
    icon: 'smile' as const,
    name: { en: 'Reading Arabic for Kids', ar: 'القراءة العربية للأطفال' },
    summary: {
      en: 'Patient, playful reading practice — from letters to full passages, at a child’s pace.',
      ar: 'تدريب قراءة صبور وممتع — من الحروف إلى النصوص الكاملة، بإيقاع الطفل.',
    },
    description: {
      en: 'Gentle lessons for young learners (from age 6): letters, words and short passages with plenty of encouragement and zero pressure.',
      ar: 'دروس لطيفة للصغار (من عمر ٦): حروف وكلمات ونصوص قصيرة بكثير من التشجيع ودون أي ضغط.',
    },
    sessionLength: { en: '30–60 min · flexible', ar: '٣٠–٦٠ دقيقة · مرنة' },
    audience: { en: 'Ages 6–12', ar: 'من ٦–١٢ سنة' },
    includes: [
      { en: 'Letters → words → full passages', ar: 'حروف ← كلمات ← نصوص كاملة' },
      { en: 'Patient, playful pacing', ar: 'إيقاع صبور وممتع' },
      { en: 'Short, focused sessions that fit kids', ar: 'حصص قصيرة مركّزة تناسب الأطفال' },
    ],
    featured: false,
  }),
  Object.freeze({
    id: 'svc-islamic-01',
    slug: 'islamic-studies',
    category: 'islamic' as const,
    icon: 'crescent' as const,
    name: { en: 'Islamic Studies', ar: 'العلوم الإسلامية' },
    summary: {
      en: 'Foundations of Islam taught in clear English — for Muslims and non-Muslims alike.',
      ar: 'أساسيات الإسلام بشرح إنجليزي واضح — للمسلمين وغير المسلمين معًا.',
    },
    description: {
      en: 'Faith, worship, prophetic biography and Islamic manners, taught accessibly for students from any background — including those simply curious about Islamic culture.',
      ar: 'العقيدة والعبادة والسيرة والآداب الإسلامية، بأسلوب مبسّط لكل طالب بغض النظر عن خلفيته — ومنهم المهتمون بالثقافة الإسلامية فقط.',
    },
    sessionLength: { en: '30–60 min · flexible', ar: '٣٠–٦٠ دقيقة · مرنة' },
    audience: { en: 'Muslims & non-Muslims welcome', ar: 'مسلمون وغير مسلمين مرحب بهم' },
    includes: [
      { en: 'Faith, worship & prophetic biography', ar: 'العقيدة والعبادة والسيرة النبوية' },
      { en: 'Islamic manners & everyday practice', ar: 'الآداب الإسلامية والتطبيق اليومي' },
      { en: 'Taught in clear, simple English', ar: 'شرح بالإنجليزية الواضحة البسيطة' },
    ],
    featured: false,
  }),
]);
