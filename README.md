# [qlawmarq.github.io](https://qlawmarq.github.io/)

![Preview](./tests/test.ts-snapshots/screenshot-home-1-chromium-darwin.png)

## Setup development environment

Make sure Node.js is installed on your machine.

To set up a local development environment, do the following:

```bash
npm i
npm run dev
```

To run an E2E test with Playwright Test, do the following:

```bash
npx playwright install
npm run e2e:test
```

To update [snapshots](https://playwright.dev/docs/test-snapshots), do the following:

```bash
npm run e2e:update
```

See [Playwright Docs](https://playwright.dev/docs/intro) for more details.

## Deployment

Automated deployment to [GitHub Pages](https://pages.github.com/) by [GitHub Actions](https://github.com/features/actions).  
Using [SSG](https://kit.svelte.dev/docs/adapter-static) to building static files.  
See [static.yml](.github/workflows/static.yml) for more details.
