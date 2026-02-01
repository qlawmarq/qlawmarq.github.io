# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with SvelteKit, TypeScript, and deployed as a static site to GitHub Pages. Features internationalization (EN/JA), GitHub API integration, and retro-styled UI with animations.

## Common Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production (outputs to /build)
pnpm preview          # Preview production build
pnpm check            # Type-check with svelte-check
pnpm check:watch      # Type-check in watch mode
pnpm lint             # Run Prettier & ESLint with auto-fix
pnpm e2e:test         # Run Playwright E2E tests (chromium & iPhone 12)
pnpm e2e:update       # Update Playwright snapshots
pnpm typesafe-i18n    # Regenerate i18n types after modifying translations
```

## Architecture

### Data Flow

- **Development**: Uses cached JSON files in `src/lib/json/` (ownedRepos.json, starredRepos.json)
- **Production**: Fetches live data from GitHub API and RSS feed (`https://qlawmarq.net/{lang}/blog/rss`)
- Environment detection via `process.env.NODE_ENV`

### Key Components

- `GlitchText.svelte`: Animated text with character-by-character glitch effect
- `Card.svelte`: Retro-styled cards with slide-in animation
- `Header.svelte`: Logo and language selector
- `+page.svelte`: Main page fetching GitHub repos, starred repos, and blog posts

### Internationalization (typesafe-i18n)

- Locales: `en` (base), `ja`
- Translation files: `src/i18n/{locale}/index.ts`
- Svelte stores: `locale` (current locale), `LL` (translation functions), `setLocale()` (change locale)
- After modifying translations, run `pnpm typesafe-i18n` to regenerate types

### Static Site Generation

- All pages prerendered via `adapter-static`
- Prerender enabled in `+layout.ts` and `+page.ts` with `export const prerender = true`
- Output directory: `build/`

## Tech Stack

- **Framework**: SvelteKit v2 with Svelte v4
- **Build**: Vite
- **Package Manager**: pnpm (engine-strict, requires Node v24)
- **Testing**: Playwright (visual regression with snapshots)
- **Linting**: ESLint v9 (flat config) + Prettier
