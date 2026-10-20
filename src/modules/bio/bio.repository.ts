import { StaticReadOnlyRepository } from '@core/repositories/Repository';
import type { TeacherProfile } from './bio.types';
import { TEACHER_PROFILE } from './bio.data';

/** Read model for the bio domain. */
export interface BioRepository {
  getProfile(): Promise<TeacherProfile>;
}

/**
 * Repository Pattern: static implementation over bundled content.
 * The interface is async so a CMS/REST implementation can be swapped in
 * at the composition root with zero module changes.
 */
export class StaticBioRepository
  extends StaticReadOnlyRepository<TeacherProfile>
  implements BioRepository
{
  constructor(private readonly profile: TeacherProfile = TEACHER_PROFILE) {
    super([profile]);
  }

  async getProfile(): Promise<TeacherProfile> {
    return this.profile;
  }

  protected idOf(entity: TeacherProfile): string {
    return entity.id;
  }

  protected slugOf(entity: TeacherProfile): string {
    return entity.slug;
  }
}
