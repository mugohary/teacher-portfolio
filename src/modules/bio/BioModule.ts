import { mount } from '@core/utils/dom';
import type { I18nService } from '@core/i18n/I18nService';
import type { BioRepository } from './bio.repository';
import type { TeacherProfile } from './bio.types';
import { createHeroSection } from './components/HeroSection';
import { createCredentialsSection } from './components/CredentialsSection';
import { createApproachSection } from './components/ApproachSection';

export interface BioModuleDeps {
  readonly repository: BioRepository;
  readonly i18n: I18nService;
  /** Composition root supplies navigation side-effects (keeps module pure). */
  readonly onBookCTA: () => void;
}

/** Bio feature module: hero + about/credentials + teaching approach. */
export class BioModule {
  private container: HTMLElement | null = null;
  private profile: TeacherProfile | null = null;

  constructor(private readonly deps: BioModuleDeps) {
    // Subscribe exactly once — mount() may be called repeatedly.
    deps.i18n.onLocaleChange(() => this.render());
  }

  async mount(container: HTMLElement): Promise<void> {
    this.container = container;
    this.profile = await this.deps.repository.getProfile();
    this.render();
  }

  private render(): void {
    if (!this.container || !this.profile) return;
    mount(
      this.container,
      createHeroSection(this.profile, this.deps.i18n, this.deps.onBookCTA),
      createCredentialsSection(this.profile, this.deps.i18n),
      createApproachSection(this.profile.teachingApproach, this.deps.i18n),
    );
  }
}
