import type { Identifiable, LocalizedText } from '@core/types/shared';

/** A verified credential: degree, certification or experience entry. */
export interface Credential extends Identifiable {
  readonly kind: 'degree' | 'certificate' | 'experience' | 'ijazah';
  readonly title: LocalizedText;
  readonly issuer?: LocalizedText;
  readonly year?: number;
  readonly detail?: LocalizedText;
}

/** One column of the teaching-approach section (how a lesson actually runs). */
export interface ApproachCard extends Identifiable {
  readonly title: LocalizedText;
  readonly summary?: LocalizedText;
  /** Ordered flow steps, e.g. "review → correct → new portion → …". */
  readonly steps: readonly LocalizedText[];
  readonly note?: LocalizedText;
}

/** A headline stat shown in the hero (e.g. "6–40 / Ages served"). */
export interface ProfileStat {
  readonly value: LocalizedText;
  readonly label: LocalizedText;
}

/** Aggregate root of the bio domain. */
export interface TeacherProfile extends Identifiable {
  readonly fullName: LocalizedText;
  readonly honorific: LocalizedText;
  readonly discipline: LocalizedText;
  readonly tagline: LocalizedText;
  readonly intro: LocalizedText;
  readonly photoUrl: string;
  readonly audience: LocalizedText;
  readonly format: LocalizedText;
  readonly sessionLength: LocalizedText;
  readonly nativeLanguage: LocalizedText;
  readonly teachingLanguages: readonly LocalizedText[];
  readonly stats: readonly ProfileStat[];
  readonly credentials: readonly Credential[];
  readonly teachingApproach: readonly ApproachCard[];
}
