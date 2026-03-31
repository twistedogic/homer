## Why

The entire app lives in a single 1425-line `index.html` with ~620 lines of inline JavaScript and inline CSS. This makes it hard to maintain, impossible to unit test, and difficult to reason about as the app grows. Introducing a build step with TypeScript and Vite enables module-level organisation, type safety, and Vitest unit tests — particularly valuable for the pure math functions (NPV, IRR, mortgage calculations) that are currently untestable.

## What Changes

- Introduce Vite as the build tool and TypeScript as the language
- Extract all inline JavaScript into typed `.ts` modules under `src/`
- Extract all inline CSS into `.css` files under `src/styles/`
- Add Vitest for unit testing pure-logic modules
- Update GitHub Actions workflow to build via Vite and deploy `dist/` to GitHub Pages
- Update service worker to cache only `index.html` (hashed JS assets handled by browser cache)

## Non-Goals

- Changing any app behaviour, UI, or calculations
- Adding a frontend framework (React, Vue, etc.)
- Strict TypeScript from day one — types added incrementally
- Workbox / full precache manifest for PWA
- CSS modules or CSS-in-JS

## Capabilities

### New Capabilities

- `build-tooling`: Vite config, TypeScript config, Vitest config, npm scripts, and CI build step

### Modified Capabilities

- `service-worker`: Cache strategy simplification — SW caches only `index.html`; hashed JS bundle handled by HTTP cache headers

## Impact

- `index.html`: Becomes a Vite HTML template; all `<script>` and `<style>` blocks removed, replaced with a single `<script type="module" src="/src/main.ts">`
- `src/`: New directory containing all TypeScript modules and CSS files
- `sw.js`: Simplified PRECACHE list (index.html only, no JS assets)
- `.github/workflows/deploy.yml`: Adds Node setup, `npm install`, `npm run build` before upload
- `package.json`: New file with Vite, TypeScript, Vitest dependencies
- `vite.config.ts`, `tsconfig.json`: New config files
