# Arabic & Quran Teacher Portfolio

A clean, modular, **zero-bloat** teacher portfolio and booking application.
Vanilla TypeScript + Vite + Tailwind CSS v4 — no framework runtime, no hydration cost, first paint in milliseconds.

## Architecture

**Feature-Driven / Domain-Oriented.** Every domain owns its types, data, repository, components and public API. Feature modules never import each other; they depend only on `src/core` contracts and receive collaborators via constructor injection. Everything is wired in one place: the composition root (`src/app.ts`).

```
public/                     Static assets (fonts preload, favicon, OG image, robots, sitemap)
src/
├── core/                   Cross-cutting kernel (no feature knowledge)
│   ├── config/             Typed env loader + frozen app config
│   ├── errors/             AppError/ValidationError + global error boundary
│   ├── i18n/               Bilingual service (en/ar, RTL-aware)
│   ├── middleware/         KoA-style validation pipeline + rule matchers
│   ├── repositories/       Repository contracts + static base implementation
│   ├── types/              Shared value types (LocalizedText, Identifiable…)
│   └── utils/              Result<T,E>, XSS-safe hyperscript `h()`, mount helpers
├── data/                   UI chrome strings (i18n dictionary)
└── modules/
    ├── seo/                SEO & Meta Configuration Manager (OG, Twitter, JSON-LD, hreflang)
    ├── bio/                Hero, credentials, at-a-glance facts, teaching approach
    ├── services/           Filterable catalog: Arabic, Quran memorization, Tajweed, kids, Islamic studies
    ├── booking/            Strategy: Calendly (inline iframe) & Preply (deep-link) + availability panel
    └── contact/            DTO + middleware validation, WhatsApp / Telegram / email channels
```

### Design patterns

| Pattern | Where | Why |
| --- | --- | --- |
| **Repository** | `core/repositories/Repository.ts`, every `*.repository.ts` | Modules consume async repository interfaces; bundled static data today, headless CMS/REST tomorrow — zero UI changes. |
| **Strategy** | `modules/booking/strategies/*` | `BookingStrategy` interface with `CalendlyStrategy` / `PreplyStrategy` + a factory that resolves `VITE_BOOKING_PROVIDER` (`auto` falls back). The booking module never branches on provider names. |
| **Middleware validation** | `core/middleware/*`, `modules/contact/middleware` | Koa-style onion pipeline (`ctx`, `next`, short-circuiting) composes field rules: trim → required → format → safety. |
| **DTO** | `modules/contact/dto/ContactDTO.ts` | Private constructor; `ContactDTO.from(unknown)` is the only entry point — untrusted form data becomes a validated, channel-agnostic message object. |
| **Composition root** | `src/app.ts` | The single file where concrete repositories/strategies/modules meet. |

## Getting started

```bash
cp .env.example .env   # then fill in your values
npm install
npm run dev            # http://localhost:5173
```

```bash
npm run build          # typecheck + production bundle in dist/
npm run preview        # serve the production build
npm run typecheck      # tsc --noEmit
```

## Configuration

All runtime configuration is environment-driven (`.env`, see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical origin for SEO, OG and JSON-LD |
| `VITE_SITE_NAME` | Brand name in meta tags and chrome |
| `VITE_DEFAULT_LOCALE` | `en` or `ar` (sets `lang`/`dir`) |
| `VITE_CONTACT_EMAIL` | Email channel target |
| `VITE_CONTACT_WHATSAPP` | digits-only international number for `wa.me` deep links |
| `VITE_CONTACT_TELEGRAM` | Telegram username (without `@`) for `t.me` deep links |
| `VITE_BOOKING_PROVIDER` | `calendly` \| `preply` \| `auto` |
| `VITE_CALENDLY_URL` | Calendly event URL (rendered as an inline **iframe** — their tracking JS bundle is intentionally not loaded) |
| `VITE_PREPLY_URL` | Preply profile URL (rendered as a branded deep-link CTA) |

> **Placeholder sentinels count as unconfigured.** As long as a URL still
> contains `your-name` / `example.com`, the booking section renders an honest
> *"opening soon"* state with a WhatsApp + contact CTA instead of a dead embed.

### Connecting Calendly (5 minutes, when ready)

1. Create a free account at [calendly.com](https://calendly.com) → **Create Event** (e.g. "Free 30-min Trial Lesson").
2. Copy the event link, e.g. `https://calendly.com/ahmed/30min`.
3. Paste it into `VITE_CALENDLY_URL` in `.env` (local) **and** `.env.production` (the file GitHub Pages builds from).
4. `npm run build` (or push to GitHub) — the scheduler embed appears automatically in the booking section.

### Going live on GitHub Pages

The repo ships with `.github/workflows/deploy.yml`: every push to `main`
typechecks, builds, and deploys to GitHub Pages — the site URL and base path
are derived automatically from the repository name.

1. Push the code (see commands below).
2. On GitHub: **Settings → Pages → Source → *GitHub Actions*** (one time only).
3. Wait for the *Deploy to GitHub Pages* workflow (Actions tab) to finish.
4. Live at `https://mugohary.github.io/teacher-portfolio/`.

```bash
git add .
git commit -m "feat: Arabic & Quran teacher portfolio"
git push -u origin main
```

Contact details live in `.env.production` (already filled in) — add your
Calendly link when ready and push again; every push redeploys automatically.

## Editing content

- **Teacher bio, credentials, teaching approach** → `src/modules/bio/bio.data.ts`
- **Services (no pricing — pricing is private by design)** → `src/modules/services/services.data.ts`
- **Availability window & prayer breaks** → `src/modules/booking/availability.data.ts`
- **SEO titles, descriptions, JSON-LD** → `src/modules/seo/seo.data.ts`
- **UI chrome copy (en/ar)** → `src/data/i18n.data.ts`

## Extending

- **New booking provider**: implement `BookingStrategy` (validate, getDeepLink, mount, destroy), add it to `BookingStrategyFactory`, extend `VITE_BOOKING_PROVIDER`.
- **New service**: append a `ServiceOffering` to `SERVICE_CATALOG` — the card, filter and booking pre-selection adapt automatically.
- **CMS-backed content**: implement the repository interface (`BioRepository`, `ServicesRepository`, `SeoRepository`, `ContactDirectoryRepository`) against your API and inject it in `src/app.ts`.

## Quality notes

- Strict TypeScript (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `isolatedModules`).
- DOM built via typed `h()` hyperscript — user input is inserted as text nodes, never HTML.
- Every trust boundary returns `Result<T, AppError>` instead of throwing.
- Accessibility: skip link, labelled controls, `aria-invalid`/`aria-describedby` error wiring, focus management, reduced-motion support.
- SEO: canonical, hreflang alternates, Open Graph, Twitter cards, and JSON-LD (`Person`, `WebSite`, `BreadcrumbList`) managed at runtime by `SeoManager`.
