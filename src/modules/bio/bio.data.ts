import type { TeacherProfile } from './bio.types';

/**
 * Single source of truth for the teacher's public profile.
 * Swap this repository for a headless-CMS client without touching the UI.
 *
 * Note: pricing is intentionally private — it is never published on the site.
 */
export const TEACHER_PROFILE: TeacherProfile = {
  id: 'teacher-001',
  slug: 'ahmed-alghoraib',
  honorific: { en: 'Ustadh', ar: 'الأستاذ' },
  fullName: { en: 'Ahmed Alghoraib', ar: 'أحمد الغريب' },
  discipline: {
    en: 'Arabic · Quran Memorization · Tajweed · Islamic Studies',
    ar: 'العربية · حفظ القرآن · التجويد · العلوم الإسلامية',
  },
  tagline: {
    en: 'Warm, fully adaptive one-on-one lessons — Arabic for English speakers, Quran memorization, Tajweed and Islamic studies, ages 6 to 40.',
    ar: 'دروس فردية دافئة ومرنة تمامًا — العربية للناطقين بالإنجليزية، وحفظ القرآن، والتجويد، والعلوم الإسلامية، من ٦ إلى ٤٠ سنة.',
  },
  intro: {
    en: "I'm Ahmed Alghoraib, a Cairo University graduate in Teaching Arabic to Non-Arabs. I teach Arabic for English speakers, Quran memorization techniques, Tajweed (beginner to advanced), reading Arabic for kids and Islamic studies — fully remote, one-on-one, for students in the US, UK, Australia and beyond. Every lesson adapts to you: pace, style, materials and the Arabic-to-English balance are all adjustable, and sessions run 30–60 minutes at a time that fits your schedule.",
    ar: 'أنا أحمد الغريب، خريج جامعة القاهرة في تعليم العربية لغير الناطقين بها. أُدرّس العربية للناطقين بالإنجليزية، وتقنيات حفظ القرآن، والتجويد (من المبتدئ إلى المتقدم)، والقراءة العربية للأطفال، والعلوم الإسلامية — عن بُعد بالكامل، فرديًا، لطلاب من أمريكا وبريطانيا وأستراليا وسائر الدول. كل درس يناسبك: الإيقاع والأسلوب والمواد ووازن العربية والإنجليزية كلها قابلة للتعديل، والمدة من ٣٠ إلى ٦٠ دقيقة في وقت يناسب جدولك.',
  },
  // BASE_URL keeps the path correct on GitHub Project Pages (/repo-name/…).
  photoUrl: `${import.meta.env.BASE_URL}assets/images/ahmed-alghoraib.jpg`,
  audience: {
    en: 'Ages 6–40 · US, UK & Australia focus · Muslims and non-Muslims interested in Islamic culture · English-proficient students',
    ar: 'من ٦ إلى ٤٠ سنة · تركيز على أمريكا وبريطانيا وأستراليا · مسلمون وغير مسلمين مهتمين بالثقافة الإسلامية · طلاب يتقنون الإنجليزية',
  },
  format: {
    en: 'Fully remote, 1-on-1 online (group classes on Zoom when preferred) — never in person',
    ar: 'عن بُعد بالكامل، فردي عبر الإنترنت (حصص جماعية عبر زوم عند الرغبة) — لا حضور أبدًا',
  },
  sessionLength: { en: '30–60 minutes, flexible', ar: '٣٠–٦٠ دقيقة حسب الراحة' },
  nativeLanguage: { en: 'Arabic (native)', ar: 'العربية (لغة أم)' },
  teachingLanguages: [
    { en: 'English', ar: 'الإنجليزية' },
    { en: 'Arabic', ar: 'العربية' },
  ],
  stats: [
    {
      value: { en: '2', ar: '٢' },
      label: { en: 'Years experience', ar: 'سنوات خبرة' },
    },
    {
      value: { en: '6–40', ar: '٦–٤٠' },
      label: { en: 'Ages served', ar: 'الفئات العمرية' },
    },
    {
      value: { en: '30–60', ar: '٣٠–٦٠' },
      label: { en: 'Minutes / session', ar: 'دقيقة / حصة' },
    },
  ],
  credentials: [
    {
      id: 'cr-degree-001',
      slug: 'cairo-university-teaching-arabic',
      kind: 'degree',
      title: { en: 'Degree: Teaching Arabic to Non-Arabs', ar: 'درجة جامعية: تعليم العربية لغير الناطقين بها' },
      issuer: { en: 'Cairo University', ar: 'جامعة القاهرة' },
      detail: {
        en: 'Specialized preparation for teaching Arabic to English speakers.',
        ar: 'إعداد متخصص في تعليم العربية للناطقين بالإنجليزية.',
      },
    },
    {
      id: 'cr-cert-001',
      slug: 'ef-set-english',
      kind: 'certificate',
      title: { en: 'English — Fluent, near C1', ar: 'الإنجليزية — طلاقة قريبة من C1' },
      issuer: { en: 'EF SET certified (Listening & Reading)', ar: 'معتمد من EF SET (الاستماع والقراءة)' },
      detail: {
        en: 'Speaking self-assessed B2–C1 — lessons run comfortably in English.',
        ar: 'التحدث بتقدير ذاتي B2–C1 — الدروس تُدار بثقة باللغة الإنجليزية.',
      },
    },
    {
      id: 'cr-exp-001',
      slug: 'two-years-online-teaching',
      kind: 'experience',
      title: { en: '2 years of 1-on-1 online teaching', ar: 'سنتان من التدريس الفردي عن بُعد' },
      detail: {
        en: 'No formal teacher training — a practical, self-directed methodology refined lesson by lesson.',
        ar: 'دون تدريب رسمي — منهج عملي ذاتي التوجيه تمت صقله درسًا بدرس.',
      },
    },
  ],
  teachingApproach: [
    {
      id: 'ap-arabic',
      slug: 'arabic-lessons',
      title: { en: 'Arabic Lessons', ar: 'دروس العربية' },
      steps: [
        { en: 'Warm-up conversation', ar: 'تهيئة بمحادثة ساخنة' },
        { en: 'Al-Arabiyyah Bayna Yadayk book', ar: 'كتاب العربية بين يديك' },
        { en: 'Flexible pace, style & materials', ar: 'إيقاع وأسلوب ومواد مرنة' },
        { en: 'Adjustable Arabic ↔ English balance', ar: 'توازن قابل للتعديل بين العربية والإنجليزية' },
      ],
    },
    {
      id: 'ap-quran',
      slug: 'quran-sessions',
      title: { en: 'Quran Sessions', ar: 'حصص القرآن' },
      steps: [
        { en: 'Review previously memorized portions', ar: 'مراجعة الحفظ السابق' },
        { en: 'Correct past mistakes', ar: 'تصحيح الأخطاء السابقة' },
        { en: 'Recite a new portion', ar: 'تلاوة نصيب جديد' },
        { en: 'Repeat difficult ayahs', ar: 'تكرار الآيات الصعبة' },
        { en: 'Assign a new surah / ayah', ar: 'إيصال سورة أو آية جديدة' },
      ],
    },
    {
      id: 'ap-tajweed',
      slug: 'tajweed-approach',
      title: { en: 'Tajweed', ar: 'التجويد' },
      steps: [
        { en: 'A separate theory slot…', ar: 'موضع نظري منفصل…' },
        { en: '…or taught alongside memorization', ar: '…أو يُدرَّس مع الحفظ' },
      ],
      note: {
        en: 'Beginner, intermediate and advanced levels.',
        ar: 'مستويات: مبتدئ ومتوسط ومتقدم.',
      },
    },
    {
      id: 'ap-adaptable',
      slug: 'fully-adaptable',
      title: { en: 'Fully Adaptable', ar: 'مرنة بالكامل' },
      steps: [
        { en: 'Pace', ar: 'الإيقاع' },
        { en: 'Style', ar: 'الأسلوب' },
        { en: 'Materials', ar: 'المواد' },
        { en: 'Language balance', ar: 'وازن اللغة' },
      ],
      note: {
        en: 'Everything adjusts to the student — nothing is fixed.',
        ar: 'كل شيء يناسب الطالب — لا شيء ثابت.',
      },
    },
  ],
};
